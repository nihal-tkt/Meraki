import { BotMessageSquare } from "lucide-react";
import { BatteryCharging } from "lucide-react";
import { Fingerprint } from "lucide-react";
import { ShieldHalf } from "lucide-react";
import { PlugZap } from "lucide-react";
import { GlobeLock } from "lucide-react";

import user1 from "../assets/profile-pictures/user1.jpg";
import user2 from "../assets/profile-pictures/user2.jpg";
import user3 from "../assets/profile-pictures/user3.jpg";
import user4 from "../assets/profile-pictures/user4.jpg";
import user5 from "../assets/profile-pictures/user5.jpg";
import user6 from "../assets/profile-pictures/user6.jpg";

export const navItems = [
  { label: "Features", href: "#" },
  { label: "Workflow", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Testimonials", href: "#" },
];

export const testimonials = [
  {
    user: "Alex Johnson",
    company: "Mastering Web Development",
    image: user1,
    text: "This course was a game-changer for my career! The instructor's clear explanations and practical projects helped me land my first web development job. Highly recommended!",
  },
  {
    user: "Samantha Lee",
    company: "Python for Data Science",
    image: user2,
    text: "An incredible learning experience! The hands-on exercises made complex concepts easy to understand. The instructor's knowledge and teaching style were outstanding.",
  },
  {
    user: "Carlos Fernandez",
    company: "Digital Marketing Strategies",
    image: user3,
    text: "The insights and strategies provided in this course boosted my marketing skills significantly. The step-by-step guidance was invaluable. A must-take for marketing enthusiasts.",
  },
  {
    user: "Nina Patel",
    company: "Graphic Design Essentials",
    image: user4,
    text: "A comprehensive and engaging course! The lessons were well-structured, and the instructor provided detailed feedback on projects. It’s the best design course I’ve taken so far.",
  },
  {
    user: "Marcus Green",
    company: "Machine Learning Fundamentals",
    image: user5,
    text: "Fantastic course! It covers the core concepts of machine learning in an accessible way. The practical examples helped reinforce my understanding of complex algorithms.",
  },
  {
    user: "Emily Thompson",
    company: "Public Speaking Mastery",
    image: user6,
    text: "This course gave me the confidence I needed to excel at public speaking. The techniques and real-world tips shared by the instructor were truly transformative.",
  },
];


export const features = [
  {
    icon: <BotMessageSquare />,
    text: "Interactive Learning Interface",
    description:
      "Engage with courses through an interactive and intuitive learning environment, designed to make the learning experience smooth and enjoyable.",
  },
  {
    icon: <Fingerprint />,
    text: "Cross-Platform Access",
    description:
      "Access courses anytime, anywhere on multiple devices including mobile, desktop, and tablets for a flexible learning experience.",
  },
  {
    icon: <ShieldHalf />,
    text: "Diverse Course Templates",
    description:
      "Get started quickly with pre-built course templates, allowing instructors to focus on content creation.",
  },
  {
    icon: <BatteryCharging />,
    text: "Real-Time Feedback",
    description:
      "Receive feedback and insights in real-time on course progress, helping users stay on track and engaged.",
  },
  {
    icon: <PlugZap />,
    text: "Collaborative Learning",
    description:
      "Collaborate with peers, discuss course topics, and connect with instructors through integrated communication tools.",
  },
  {
    icon: <GlobeLock />,
    text: "Analytics and Insights",
    description:
      "Monitor learning progress and performance with a detailed analytics dashboard for both students and instructors.",
  },
];



export const pricingOptions = [
  {
    title: "Free",
    price: "$0",
    features: [
      "Private board sharing",
      "5 Gb Storage",
      "Web Analytics",
      "Private Mode",
    ],
  },
  {
    title: "Pro",
    price: "$10",
    features: [
      "Private board sharing",
      "10 Gb Storage",
      "Web Analytics (Advance)",
      "Private Mode",
    ],
  },
  {
    title: "Enterprise",
    price: "$200",
    features: [
      "Private board sharing",
      "Unlimited Storage",
      "High Performance Network",
      "Private Mode",
    ],
  },
];

export const resourcesLinks = [
  { href: "#", text: "Getting Started" },
  { href: "#", text: "Documentation" },
  { href: "#", text: "Tutorials" },
  { href: "#", text: "API Reference" },
  { href: "#", text: "Community Forums" },
];

export const platformLinks = [
  { href: "#", text: "Features" },
  { href: "#", text: "Supported Devices" },
  { href: "#", text: "System Requirements" },
  { href: "#", text: "Downloads" },
  { href: "#", text: "Release Notes" },
];

export const communityLinks = [
  { href: "#", text: "Events" },
  { href: "#", text: "Meetups" },
  { href: "#", text: "Conferences" },
  { href: "#", text: "Hackathons" },
  { href: "#", text: "Jobs" },
];