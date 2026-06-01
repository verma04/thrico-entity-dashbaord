"use client";

import React, { useState } from "react";
import {
  useGetInterests,
  useAddInterest,
  useUpdateInterest,
  useDeleteInterest,
  Interest,
  useBulkAddInterests,
  useGetUsersByInterestNeo4j,
} from "@/graphql/quries/interests/interest-queries";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Pencil,
  Trash2,
  Filter,
  Loader2,
  Heart,
  Sparkles,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { notify } from "@/lib/notify";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ── Color palette for interests ──
const INTEREST_COLORS = [
  "#ec4899", // Pink
  "#f43f5e", // Rose
  "#8b5cf6", // Purple
  "#3b82f6", // Blue
  "#06b6d4", // Cyan
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
];

function getInterestColor(index: number) {
  return INTEREST_COLORS[index % INTEREST_COLORS.length];
}

// ── Add/Edit Dialog ──
function InterestDialog({
  open,
  onOpenChange,
  editingInterest,
  isLoading,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingInterest: Interest | null;
  isLoading: boolean;
  onSave: (values: { title: string }) => void;
}) {
  const [title, setTitle] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setTitle(editingInterest?.title || "");
    }
  }, [open, editingInterest]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({ title: title.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border-slate-200">
        <DialogHeader>
          <DialogTitle className="font-bold text-slate-800">
            {editingInterest ? "Edit Interest" : "Add Interest"}
          </DialogTitle>
          <DialogDescription className="font-medium text-slate-500">
            {editingInterest
              ? "Update the interest name"
              : "Create a new interest to classify your members' hobbies, topics, or areas of passion"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label
              htmlFor="interest-title"
              className="text-sm font-semibold text-slate-700"
            >
              Interest Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              id="interest-title"
              placeholder="e.g., Photography, Travel, Gardening"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border-slate-200 focus-visible:ring-rose-500/20"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            variant="outline"
            className="rounded-lg font-semibold border-slate-200"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || isLoading}
            className="rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {editingInterest ? "Update" : "Save Interest"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Interest Users Sheet ──
function InterestUsersSheet({
  interest,
  open,
  onOpenChange,
}: {
  interest: Interest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data, loading } = useGetUsersByInterestNeo4j({
    variables: { interestId: interest?.id || "", limit: 50 },
    skip: !interest,
  });

  const users = data?.getUsersByInterestNeo4j?.data || [];
  const totalCount = data?.getUsersByInterestNeo4j?.totalCount || 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md w-full overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-500" />
            {interest?.title} Users
          </SheetTitle>
          <SheetDescription>
            {loading
              ? "Loading..."
              : `Found ${totalCount} users with this interest`}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 mt-6">
          {loading ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))
          ) : users.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <Users className="h-10 w-10 mx-auto text-slate-300 mb-3" />
              <p>No users found for this interest.</p>
            </div>
          ) : (
            users.map((user) => (
              <UserProfileHoverCard
                key={user.id}
                user={{ ...user, id: user.id }}
              >
                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
                  <Avatar className="h-10 w-10 border border-slate-200">
                    <AvatarImage
                      src={
                        user.avatar
                          ? `https://cdn.thrico.network/${user.avatar}`
                          : ""
                      }
                      alt={user.firstName || ""}
                    />
                    <AvatarFallback className="bg-indigo-50 text-indigo-600 font-semibold">
                      {user.firstName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    {user.headline && (
                      <p className="text-xs text-slate-500 truncate">
                        {user.headline}
                      </p>
                    )}
                  </div>
                </div>
              </UserProfileHoverCard>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Interests Grid ──
function InterestsGrid({
  interests,
  isLoading,
  onEdit,
  onDelete,
  onViewUsers,
}: {
  interests: Interest[];
  isLoading: boolean;
  onEdit: (interest: Interest) => void;
  onDelete: (interest: Interest) => void;
  onViewUsers: (interest: Interest) => void;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <Card
              key={i}
              className="border border-slate-200 rounded-xl overflow-hidden"
            >
              <Skeleton className="h-1.5 w-full" />
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    );
  }

  if (interests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-xl border border-slate-200 border-dashed m-4">
        <Heart className="h-10 w-10 text-slate-300 mb-4" />
        <h3 className="text-xl font-semibold text-slate-800 tracking-tight">
          No interests found
        </h3>
        <p className="text-sm text-slate-500 text-center mt-2 max-w-sm">
          Try adding a new interest or adjusting your search filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6">
      {interests.map((interest, index) => {
        const color = getInterestColor(index);
        return (
          <Card
            key={interest.id}
            onClick={() => onViewUsers(interest)}
            className="border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden rounded-xl hover:border-rose-500/20 hover:-translate-y-1 bg-white cursor-pointer"
          >
            {/* Color bar */}
            <div
              className="h-1.5 w-full opacity-80 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: color }}
            />
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center shadow-sm"
                    style={{
                      backgroundColor: `${color}15`,
                      color: color,
                    }}
                  >
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-md w-full text-slate-800 group-hover:text-rose-600 transition-colors">
                      {interest.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                      Interest
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(interest);
                    }}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(interest);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ── Recommended Interests ──
const RECOMMENDED_INTERESTS = [
  // Health & Wellness
  "Yoga",
  "Meditation",
  "Fitness",
  "Weight Loss",
  "Healthy Eating",
  "Mental Health",
  "Mindfulness",
  "Home Workouts",
  "Holistic Healing",
  "Sleep Optimization",

  // Arts & Creativity
  "Painting",
  "Photography",
  "Digital Art",
  "Writing",
  "Crafts",
  "Sketching",
  "DIY Projects",
  "Pottery",
  "Graphic Design",
  "Calligraphy",

  // Gaming
  "PC Gaming",
  "Console Gaming",
  "Mobile Games",
  "Esports",
  "RPGs",
  "Strategy Games",
  "Game Development",
  "VR Gaming",
  "Retro Games",

  // Education & Learning
  "Online Courses",
  "Coding",
  "Language Learning",
  "Study Groups",
  "STEM",
  "Reading Groups",
  "Personal Development",
  "Career Coaching",
  "Study Abroad",
  "Skill Sharing",

  // Lifestyle & Hobbies
  "Gardening",
  "Home Decor",
  "Travel",
  "Fashion",
  "Beauty Tips",
  "Journaling",
  "Minimalism",
  "Pet Care",
  "Foodies",
  "Sustainable Living",

  // Career
  "Freelancing",
  "Networking",
  "Marketing",
  "Productivity",
  "Remote Work",
  "Leadership",
  "Resume Building",
  "UX/UI Design",

  // Startup & Entrepreneurship
  "Pitch Practice",
  "MVP Development",
  "Startup Funding",
  "Founders’ Network",
  "Accelerator Programs",
  "Product-Market Fit",
  "Startup Law",
  "Investor Relations",
  "Growth Hacking",
  "Tech for Good",
  "Go To Market",
  "Co-working Space",
  "Grants",

  // Music
  "Bollywood",
  "Rock",
  "Hip-Hop",
  "Indie",
  "Live Shows",
  "DJing",
  "Music Production",
  "K-pop",
  "Bhangra",

  // Sports & Outdoors
  "Football",
  "Cricket",
  "Running",
  "Cycling",
  "Hiking",
  "Gym Workouts",
  "Adventure",
  "Scuba Diving",
  "Camping",
  "Hockey",
  "Pickel Ball",
  "Tennis",
  "Swimming",

  // Technology
  "AI & ML",
  "Cybersecurity",
  "Blockchain",
  "IOT",
  "Data Science",
  "Open Source",
  "Robotics",
  "Analytics",

  // Community & Causes
  "Volunteering",
  "Environmentalism",
  "LGBTQ+",
  "Mental Health Advocacy",
  "Animal Welfare",
  "Women's Empowerment",
  "Blood Donation",
  "Climate Action",
  "Local Events",
  "Fundraising",
  "NGO",
  "Not for Profit",

  // Books & Literature
  "Fiction",
  "Non-fiction",
  "Poetry",
  "Book Clubs",
  "Biographies",
  "Fantasy Novels",
  "Audiobooks",
  "Reading Challenges",
  "Self-help Books",
  "Mystery & Thrillers",

  // Food & Cooking
  "Baking",
  "Vegan Recipes",
  "Street Food",
  "Home Cooking",
  "International Cuisine",
  "Meal Prep",
  "Food Photography",
  "BBQ",
  "Desserts",
  "Healthy Snacks",

  // Travel & Exploration
  "Backpacking",
  "Solo Travel",
  "Weekend Getaways",
  "Road Trips",
  "Cultural Travel",
  "Travel Photography",
  "Luxury Travel",
  "Digital Nomads",
  "Heritage Sites",
  "Eco-Tourism",

  // Parenting & Family
  "New Moms",
  "Single Parents",
  "Parenting Tips",
  "Kids Activities",
  "Homeschooling",
  "Baby Care",
  "Teen Parenting",
  "Family Travel",
  "Special Needs Parenting",
  "Work-Life Balance",

  // Culture & Traditions
  "Local Cuisine",
  "Folklore",
  "Traditional Crafts",
  "Ethnic Fashion",
  "Religious Festivals",
  "Cultural Exchange",
  "Ancestry",
  "Indigenous Cultures",
  "Multilingualism",
  "Historical Landmarks",

  // Movies & TV Shows
  "Hollywood",
  "Netflix Originals",
  "TV Show Reviews",
  "Cinephiles",
  "Documentaries",
  "Classic Films",
  "Movie Trivia",
  "Fan Theories",
  "Short Films",

  // Social & Dating
  "Making Friends",
  "Online Dating",
  "Dating Advice",
  "Relationship Tips",
  "Icebreaker Games",
  "Breakup Support",
  "Love Languages",
  "Virtual Speed Dating",
  "Couples Goals",
  "Friendship Goals",

  // Philosophy & Psychology
  "Positive Psychology",
  "Stoicism",
  "Mindset Growth",
  "Cognitive Science",
  "Philosophy 101",
  "Self-Awareness",
  "Existentialism",
  "Behavioral Psychology",
  "Emotional Intelligence",
  "Critical Thinking",

  // Finance & Money
  "Budgeting",
  "Saving Hacks",
  "Crypto",
  "Stock Market",
  "Real Estate",
  "Financial Literacy",
  "Passive Income",
  "Retirement Planning",
  "Credit Score Tips",
  "Tax Planning",

  // News & Current Affairs
  "World Politics",
  "Breaking News",
  "Local News",
  "Climate Crisis",
  "Tech News",
  "Economic Trends",
  "Legal Reforms",
  "Health News",
  "Social Justice",
  "Media Literacy",

  // DIY & Home Improvement
  "Woodworking",
  "Interior Design",
  "Upcycling",
  "Tool Hacks",
  "Gardening Projects",
  "Smart Homes",
  "Home Renovation",
  "Painting Walls",
  "Furniture Makeover",
  "Tiny Homes",

  // Career Development
  "Job Hunting",
  "Resume Reviews",
  "Interview Prep",
  "LinkedIn Tips",
  "Workplace Skills",
  "Career Switching",
  "Public Speaking",
  "Personal Branding",
  "Promotions & Raises",

  // Science & Discovery
  "Astronomy",
  "Space Exploration",
  "Physics Fun",
  "Chemistry Experiments",
  "Scientific News",
  "Wildlife Research",
  "Environmental Science",
  "Oceanography",
  "Genetics",
  "Citizen Science",

  // Women Empowerment
  "Career for Women",
  "Health & Hygiene",
  "Safety & Rights",
  "Female Entrepreneurs",
  "Women in Tech",
  "Inspirational Women",
  "Motherhood & Career",
  "Women in Sports",
  "Body Positivity",
  "Gender Equality",

  // Pets & Animals
  "Dog Training",
  "Cat Lovers",
  "Pet Nutrition",
  "Exotic Pets",
  "Animal Rescue",
  "Pet Adoption",
  "Wildlife Enthusiasts",
  "Aquarium Setup",
  "Pet Accessories",
  "Animal Rights",

  // Spirituality & Faith
  "Mindful Living",
  "Daily Devotionals",
  "Prayers & Meditation",
  "Interfaith Dialogues",
  "Scriptures & Texts",
  "Spiritual Quotes",
  "Sacred Music",
  "Rituals & Traditions",
  "Fasting & Festivals",
  "Inner Peace",

  // Self-Improvement
  "Habit Building",
  "Confidence Boost",
  "Morning Routines",
  "Vision Boards",
  "Mindset Shifts",
  "Life Coaching",
  "Productivity Systems",
  "Goal Setting",

  // Performing Arts
  "Theatre Acting",
  "Stand-Up Comedy",
  "Improvisation",
  "Stage Design",
  "Dance Forms",
  "Monologue Practice",
  "Stage Fright Tips",
  "Spoken Word",
  "Musical Theatre",
  "Street Performances",

  // Brain Games & Puzzles
  "Crosswords",
  "Sudoku",
  "Logic Games",
  "Escape Rooms",
  "Trivia Nights",
  "Memory Challenges",
  "Brain Training",
  "Word Games",
  "Riddles",
  "Puzzle Solvers Group",

  // Digital Nomad Life
  "Co-working Spaces",
  "Visa-Free Travel",
  "Time Zone Hacks",
  "Remote Jobs",
  "Digital Tools",
  "Nomad Visas",
  "Travel Insurance",
  "Minimalist Packing",
  "Nomad Meetups",

  // Health Tech & Biohacking
  "Wearables",
  "Intermittent Fasting",
  "Sleep Tracking",
  "Nootropics",
  "Cold Showers",
  "Red Light Therapy",
  "Bloodwork Insights",
  "Longevity Hacks",
  "Keto & Biohacking",

  // Teachers & Educators
  "Lesson Planning",
  "EdTech Tools",
  "Online Teaching",
  "Classroom Management",
  "Inclusive Education",
  "Exam Prep",
  "Student Engagement",
  "Remote Learning",
  "Teacher Wellness",
  "Curriculum Design",

  // Law & Legal
  "Legal Advice",
  "Constitutional Law",
  "Contract Law",
  "Startups & IP",
  "Cyber Law",
  "Legal News",
  "Mock Trials",
  "Law Student Tips",
  "Case Studies",
  "Legal Awareness",

  // Technology (Extra)
  "Vibe Coding",
  "JavaScript",
  "Frontend Dev",
  "Backend Dev",
  "App Development",
  "APIs & SDKs",
  "Open Source Projects",
  "DevOps",
  "Code Review Sessions",

  // Students & Campus Life
  "College Admissions",
  "Exam Stress Tips",
  "Campus Events",
  "Scholarships",
  "Study Tips",
  "Student Clubs",
  "Graduation Prep",
  "Notes Sharing",
  "Final Year Projects",

  // Productivity & Systems
  "Bullet Journaling",
  "Pomodoro Technique",
  "Notion Templates",
  "Time Blocking",
  "Eisenhower Matrix",
  "Focus Groups",
  "Digital Decluttering",
  "GTD (Getting Things Done)",
  "Minimalist Planning",
  "Deep Work",

  // Languages & Linguistics
  "Language Exchange",
  "Grammar Help",
  "Accent Practice",
  "Polyglots",
  "Sign Language",
  "Word of the Day",
  "Translation Tips",
  "Dialect Discussions",
  "Slang & Idioms",
  "Language Quizzes",

  // Public Speaking & Debate
  "Speech Writing",
  "Debate Clubs",
  "Body Language",
  "Voice Training",
  "Impromptu Speaking",
  "Toastmasters",
  "Storytelling",
  "Elevator Pitches",
  "Panel Moderation",
  "Persuasive Speaking",
  "Overcoming Stage Fright",

  // Dance & Movement
  "Zumba",
  "Hip Hop",
  "Ballet",
  "Classical Dance",
  "Contemporary",
  "Street Dance",
  "Choreography",
  "Dance Fitness",
  "Cultural Dances",
  "Freestyle Battles",

  // Design & Aesthetics
  "UI/UX Design",
  "Typography",
  "Color Theory",
  "Design Portfolios",
  "Logo Design",
  "Behance Showcases",
  "Motion Graphics",
  "Design Feedback",
  "Prototyping Tools",
  "Minimal Design",

  // Podcasting & Audio
  "Podcast Creation",
  "Audio Editing",
  "Equipment Reviews",
  "Voiceovers",
  "Hosting Tips",
  "Interviewing Skills",
  "Podcast Promotion",
  "Niche Podcasting",
  "Sound Effects",
  "Monetization Strategies",

  // Space & Astronomy
  "Stargazing",
  "Planetary Science",
  "Space Tech",
  "Telescopes",
  "Astrophysics",
  "Black Holes",
  "Mars Colonization",
  "Moon Phases",

  // Baking & Desserts
  "Cake Decorating",
  "Sourdough Baking",
  "Cookies & Biscuits",
  "Pies & Tarts",
  "Baking Hacks",
  "Gluten-Free Treats",
  "Chocolate Lovers",
  "Cupcake Art",
  "Festive Baking",
  "Bread Making",

  // Innovation & Creativity
  "Idea Incubation",
  "Brainstorming",
  "Creative Thinking",
  "Design Sprints",
  "Disruption Trends",
  "Prototyping Ideas",
  "Concept Testing",
  "Creative Confidence",
  "Blue Ocean Thinking",
  "Innovation Labs",

  // Alternative Healing
  "Reiki",
  "Crystal Healing",
  "Sound Therapy",
  "Aromatherapy",
  "Chakra Balancing",
  "Herbal Remedies",
  "Energy Medicine",
  "Breathwork",
  "Ayurvedic Practices",
  "Emotional Freedom Technique (EFT)",

  // Shopping & Style
  "Streetwear",
  "Thrift Finds",
  "Capsule Wardrobes",
  "Style Guides",
  "Luxury Fashion",
  "Sneakerheads",
  "Fashion Deals",
  "Outfit of the Day (OOTD)",
  "Personal Styling",
  "Fashion Hauls",

  // Life Coaching & Mentorship
  "Vision Building",
  "Accountability Circles",
  "Mentorship Matching",
  "Coaching Techniques",
  "Life Purpose Discovery",
  "Leadership Growth",
  "Goal Mapping",
  "Coaching Tools",
  "Breakthrough Sessions",
  "Empowerment Tips",

  // Culinary Arts
  "Knife Skills",
  "Food Plating",
  "Global Cuisine",
  "Culinary School Tips",
  "Fermentation",
  "Food Styling",
  "Gourmet Cooking",
  "Sauces & Dressings",
  "Culinary Competitions",
  "Chef Life",

  // Adventure & Thrill
  "Skydiving",
  "Paragliding",
  "Bungee Jumping",
  "White Water Rafting",
  "Rock Climbing",
  "Zip Lining",
  "Cave Exploration",
  "Desert Safari",
  "Glacier Hiking",
  "Extreme Sports",

  // E-commerce & Dropshipping
  "Shopify Tips",
  "Product Research",
  "Store Design",
  "Payment Gateways",
  "Customer Service",
  "Logistics & Fulfillment",
  "AliExpress Sourcing",
  "Sales Funnels",
  "Print on Demand",
  "Marketplace Strategies",

  // Mind & Memory
  "Memory Techniques",
  "Brain Nutrition",
  "Focus Training",
  "Mind Mapping",
  "Neuroplasticity",
  "Speed Reading",
  "Brain Games",
  "Meditation for Clarity",
  "Learning Hacks",
  "Cognitive Boost",

  // Eco Living & Sustainability
  "Zero Waste",
  "Plastic Alternatives",
  "Urban Gardening",
  "Sustainable Fashion",
  "Upcycled Furniture",
  "Solar Energy",
  "Eco Cleaning",
  "Green Tech",
  "Climate Advocacy",
  "Conscious Consumerism",

  // Content Creation
  "Vlogging Tips",
  "YouTube Strategy",
  "Scriptwriting",
  "Short-form Videos",
  "Instagram Reels",
  "Editing Tools",
  "Monetization Tactics",
  "Camera Setup",
  "Storyboarding",
  "Influencer Marketing",
];

// ── Main Page ──
export default function InterestsPage() {
  const { data, loading, refetch } = useGetInterests();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInterest, setEditingInterest] = useState<Interest | null>(null);
  const [interestToDelete, setInterestToDelete] = useState<Interest | null>(
    null,
  );
  const [viewingInterest, setViewingInterest] = useState<Interest | null>(null);

  const [addInterest, { loading: creating }] = useAddInterest({
    onCompleted: () => {
      notify.success("Interest created successfully");
      setIsDialogOpen(false);
      refetch();
    },
    onError: (error) =>
      notify.error(error.message || "Failed to create interest"),
  });

  const [updateInterest, { loading: updating }] = useUpdateInterest({
    onCompleted: () => {
      notify.success("Interest updated successfully");
      setIsDialogOpen(false);
      setEditingInterest(null);
      refetch();
    },
    onError: (error) =>
      notify.error(error.message || "Failed to update interest"),
  });

  const [deleteInterest, { loading: deleting }] = useDeleteInterest({
    onCompleted: () => {
      notify.success("Interest deleted successfully");
      setInterestToDelete(null);
      refetch();
    },
    onError: (error) =>
      notify.error(error.message || "Failed to delete interest"),
  });

  const [bulkAddInterests, { loading: bulkAdding }] = useBulkAddInterests({
    onCompleted: (res) => {
      const addedCount = res.bulkAddInterests?.length || 0;
      if (addedCount > 0) {
        notify.success(`Successfully added ${addedCount} interests`);
      } else {
        notify.info("All recommended interests already exist");
      }
      refetch();
    },
    onError: (error) =>
      notify.error(error.message || "Failed to bulk add interests"),
  });

  const handleSave = async (values: { title: string }) => {
    if (editingInterest) {
      await updateInterest({
        variables: { input: { id: editingInterest.id, title: values.title } },
      });
    } else {
      await addInterest({
        variables: { input: values },
      });
    }
  };

  const handleDelete = async () => {
    if (!interestToDelete) return;
    await deleteInterest({
      variables: { input: { id: interestToDelete.id } },
    });
  };

  const handleBulkAdd = async () => {
    await bulkAddInterests({
      variables: { input: { titles: RECOMMENDED_INTERESTS } },
    });
  };

  const interests = data?.getInterests || [];
  const filteredInterests = interests.filter((i) =>
    i.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <EcosystemActionBar
        shadow="none"
        className="rounded-xl border border-slate-200"
      >
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-[360px]">
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search interests..."
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        <EcosystemActionBar.Group align="right">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="font-semibold text-xs px-4 h-9 rounded-lg shadow-sm gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              onClick={handleBulkAdd}
              disabled={bulkAdding}
            >
              {bulkAdding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add Recommended
            </Button>
            <Button
              className="font-semibold text-xs px-6 h-9 rounded-lg shadow-sm gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => {
                setEditingInterest(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Add Interest
            </Button>
          </div>

          <EcosystemActionBar.Separator />

          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-lg border-border bg-card text-muted-foreground hover:text-foreground shadow-none"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </EcosystemActionBar.Item>

          <EcosystemActionBar.Status active={filteredInterests.length > 0}>
            {filteredInterests.length} Interests
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 mt-4">
        <InterestsGrid
          interests={filteredInterests}
          isLoading={loading}
          onEdit={(interest) => {
            setEditingInterest(interest);
            setIsDialogOpen(true);
          }}
          onDelete={(interest) => setInterestToDelete(interest)}
          onViewUsers={(interest) => setViewingInterest(interest)}
        />
      </EcosystemContainer>

      {/* Add/Edit Dialog */}
      <InterestDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingInterest={editingInterest}
        isLoading={creating || updating}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!interestToDelete}
        onOpenChange={(open) => !open && setInterestToDelete(null)}
      >
        <AlertDialogContent className="rounded-2xl border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-slate-800">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-medium">
              This will permanently delete the interest{" "}
              <span className="font-bold text-slate-700">
                "{interestToDelete?.title}"
              </span>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="rounded-lg font-semibold border-slate-200"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold gap-2"
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleting}
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              {deleting ? "Deleting..." : "Delete Interest"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Users Sheet */}
      <InterestUsersSheet
        interest={viewingInterest}
        open={!!viewingInterest}
        onOpenChange={(open) => !open && setViewingInterest(null)}
      />
    </>
  );
}
