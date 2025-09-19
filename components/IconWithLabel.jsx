"use client";
import React from "react";
import GovIcon from "./GovIcon";

export default function IconWithLabel({ icon, label, size = 24, style = "line", color = "deep-blue", className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <GovIcon title={label} size={size} style={style} color={color} ariaLabel={label}>
        {icon}
      </GovIcon>
      <span className="text-[14px] font-medium text-deep-blue">{label}</span>
    </div>
  );
}


