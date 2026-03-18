import { FC } from "react";

interface AnimatedLinkedinProps {
  className?: string;
}

const AnimatedLinkedin: FC<AnimatedLinkedinProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* The dot of the 'i' */}
    <circle cx="4" cy="4" r="2" className="group-hover:animate-dot-drop" />

    {/* The stem of the 'i' */}
    <rect
      width="4"
      height="12"
      x="2"
      y="9"
      className="group-hover:animate-svg-draw-delayed"
    />

    {/* The 'n' curve */}
    <path
      d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
      className="group-hover:animate-svg-draw-delayed"
    />
  </svg>
);

export default AnimatedLinkedin;
