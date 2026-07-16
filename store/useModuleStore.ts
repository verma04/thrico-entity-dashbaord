import { create } from "zustand";

interface ModuleStore {
  communityModuleName: string;
  communitySingularName: string;
  setCommunityModuleName: (name: string) => void;
  jobModuleName: string;
  jobSingularName: string;
  setJobModuleName: (name: string) => void;
  listingModuleName: string;
  listingSingularName: string;
  setListingModuleName: (name: string) => void;
  momentModuleName: string;
  momentSingularName: string;
  setMomentModuleName: (name: string) => void;
  shopModuleName: string;
  shopSingularName: string;
  setShopModuleName: (name: string, singular?: string) => void;
  forumModuleName: string;
  forumSingularName: string;
  setForumModuleName: (name: string) => void;
  pollModuleName: string;
  pollSingularName: string;
  setPollModuleName: (name: string) => void;
  surveySingularName: string;
  surveyModuleName: string;
  setSurveyModuleName: (name: string) => void;
  offerModuleName: string;
  offerSingularName: string;
  setOfferModuleName: (name: string) => void;
  mentorshipModuleName: string;
  mentorshipSingularName: string;
  setMentorshipModuleName: (name: string) => void;
  eventModuleName: string;
  eventSingularName: string;
  setEventModuleName: (name: string) => void;
  gamificationModuleName: string;
  gamificationSingularName: string;
  setGamificationModuleName: (name: string) => void;
  gamesCenterModuleName: string;
  gamesCenterSingularName: string;
  setGamesCenterModuleName: (name: string) => void;
  currencyModuleName: string;
  currencySingularName: string;
  setCurrencyModuleName: (name: string) => void;
  rewardsModuleName: string;
  rewardsSingularName: string;
  setRewardsModuleName: (name: string) => void;
}

export const useModuleStore = create<ModuleStore>((set) => ({
  communityModuleName: "Communities",
  communitySingularName: "Community",
  setCommunityModuleName: (name: string) => {
    const singular =
      name === "Communities"
        ? "Community"
        : name.endsWith("s")
          ? name.slice(0, -1)
          : name;
    set({ communityModuleName: name, communitySingularName: singular });
  },
  jobModuleName: "Jobs",
  jobSingularName: "Job",
  setJobModuleName: (name: string) => {
    const singular =
      name === "Jobs" ? "Job" : name.endsWith("s") ? name.slice(0, -1) : name;
    set({ jobModuleName: name, jobSingularName: singular });
  },
  listingModuleName: "Listings",
  listingSingularName: "Listing",
  setListingModuleName: (name: string) => {
    const singular =
      name === "Listings"
        ? "Listing"
        : name.endsWith("s")
          ? name.slice(0, -1)
          : name;
    set({ listingModuleName: name, listingSingularName: singular });
  },
  momentModuleName: "Moments",
  momentSingularName: "Moment",
  setMomentModuleName: (name: string) => {
    const singular =
      name === "Moments"
        ? "Moment"
        : name.endsWith("s")
          ? name.slice(0, -1)
          : name;
    set({ momentModuleName: name, momentSingularName: singular });
  },
  shopModuleName: "Shop",
  shopSingularName: "Product",
  setShopModuleName: (name: string, singular?: string) => {
    // If a custom singular is provided, use it. Otherwise guess or default to Product.
    const computedSingular =
      singular ||
      (name === "Shop"
        ? "Product"
        : name.endsWith("s")
          ? name.slice(0, -1)
          : name);
    set({ shopModuleName: name, shopSingularName: computedSingular });
  },
  forumModuleName: "Forums",
  forumSingularName: "Forum",
  setForumModuleName: (name: string) => {
    const singular =
      name === "Forums"
        ? "Forum"
        : name.endsWith("s")
          ? name.slice(0, -1)
          : name;
    set({ forumModuleName: name, forumSingularName: singular });
  },
  pollModuleName: "Polls",
  pollSingularName: "Poll",
  setPollModuleName: (name: string) => {
    const singular =
      name === "Polls" ? "Poll" : name.endsWith("s") ? name.slice(0, -1) : name;
    set({ pollModuleName: name, pollSingularName: singular });
  },
  surveyModuleName: "Surveys",
  surveySingularName: "Survey",
  setSurveyModuleName: (name: string) => {
    const singular =
      name === "Surveys"
        ? "Survey"
        : name.endsWith("s")
          ? name.slice(0, -1)
          : name;
    set({ surveyModuleName: name, surveySingularName: singular });
  },
  offerModuleName: "Offers",
  offerSingularName: "Offer",
  setOfferModuleName: (name: string) => {
    const singular =
      name === "Offers"
        ? "Offer"
        : name.endsWith("s")
          ? name.slice(0, -1)
          : name;
    set({ offerModuleName: name, offerSingularName: singular });
  },
  mentorshipModuleName: "Mentorship",
  mentorshipSingularName: "Mentor",
  setMentorshipModuleName: (name: string) => {
    const singular =
      name === "Mentorship"
        ? "Mentor"
        : name.endsWith("s")
          ? name.slice(0, -1)
          : name;
    set({ mentorshipModuleName: name, mentorshipSingularName: singular });
  },
  eventModuleName: "Events",
  eventSingularName: "Event",
  setEventModuleName: (name: string) => {
    const singular =
      name === "Events"
        ? "Event"
        : name.endsWith("s")
          ? name.slice(0, -1)
          : name;
    set({ eventModuleName: name, eventSingularName: singular });
  },
  gamificationModuleName: "Points & Badges",
  gamificationSingularName: "Points & Badges",
  setGamificationModuleName: (name: string) => {
    const singular =
      name === "Points & Badges"
        ? "Points & Badges"
        : name.endsWith("s")
          ? name.slice(0, -1)
          : name;
    set({ gamificationModuleName: name, gamificationSingularName: singular });
  },
  gamesCenterModuleName: "Games Center",
  gamesCenterSingularName: "Game Center",
  setGamesCenterModuleName: (name: string) => {
    const singular =
      name === "Games Center"
        ? "Game Center"
        : name.endsWith("s")
          ? name.slice(0, -1)
          : name;
    set({ gamesCenterModuleName: name, gamesCenterSingularName: singular });
  },
  currencyModuleName: "Currency",
  currencySingularName: "Currency",
  setCurrencyModuleName: (name: string) => {
    const singular =
      name === "Currency"
        ? "Currency"
        : name.endsWith("s")
          ? name.slice(0, -1)
          : name;
    set({ currencyModuleName: name, currencySingularName: singular });
  },
  rewardsModuleName: "Rewards",
  rewardsSingularName: "Reward",
  setRewardsModuleName: (name: string) => {
    const singular =
      name === "Rewards"
        ? "Reward"
        : name.endsWith("s")
          ? name.slice(0, -1)
          : name;
    set({ rewardsModuleName: name, rewardsSingularName: singular });
  },
}));
