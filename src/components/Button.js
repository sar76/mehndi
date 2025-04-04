"use client";

import React from "react";
import "./Button.css";
import Link from "next/link";

const STYLES = ["btn--primary", "btn--outline", "btn--white"];
const SIZES = ["btn--medium", "btn--large"];

export const Button = ({
  children,
  type,
  onClick,
  buttonStyle,
  buttonSize,
  href,
}) => {
  const checkButtonStyle = STYLES.includes(buttonStyle)
    ? buttonStyle
    : STYLES[0];
  const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

  const buttonContent = (
    <button
      className={`btn ${checkButtonStyle} ${checkButtonSize}`}
      onClick={onClick}
      type={type || "button"}
    >
      {children}
    </button>
  );

  // If href is provided, wrap with Link
  if (href) {
    return (
      <Link href={href} passHref legacyBehavior>
        <a className={`btn ${checkButtonStyle} ${checkButtonSize}`}>
          {children}
        </a>
      </Link>
    );
  }

  // Otherwise, just return the button
  return buttonContent;
};
