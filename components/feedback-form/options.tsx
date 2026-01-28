import {
  AlignLeft,
  AlignJustify,
  Mail,
  Calendar,
  Phone,
  Link,
  Hash,
  BarChart3,
  Star,
  List,
  ChevronDown,
  Clock,
  CheckCircle,
} from "lucide-react";

export const options = [
  {
    key: "SHORT_TEXT",
    label: "Short Text",
    icon: <AlignLeft size={18} />,
  },
  {
    key: "LONG_TEXT",
    label: "Long Text",
    icon: <AlignJustify size={18} />,
  },
  { key: "EMAIL", label: "Email", icon: <Mail size={18} /> },
  { key: "PHONE", label: "Phone Number", icon: <Phone size={18} /> },
  { key: "WEBSITE", label: "Website", icon: <Link size={18} /> },
  { key: "NUMBER", label: "Number", icon: <Hash size={18} /> },
  {
    key: "OPINION_SCALE",
    label: "Opinion Scale",
    icon: <BarChart3 size={18} />,
  },
  { key: "RATING", label: "Rating", icon: <Star size={18} /> },
  {
    key: "MULTIPLE_CHOICE",
    label: "Multiple Choice",
    icon: <List size={18} />,
  },

  {
    key: "DROPDOWN",
    label: "Dropdown",
    icon: <ChevronDown size={18} />,
  },
  { key: "DATE", label: "Date", icon: <Calendar size={18} /> },
  { key: "TIME", label: "Time", icon: <Clock size={18} /> },

  { key: "YES_NO", label: "Yes/No", icon: <CheckCircle size={18} /> },
];
