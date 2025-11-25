
"use client";
import React from "react";
export default function AutoMeter({ score, label }:{ score:number; label:string }){
  if (!label) return null;
  const colors = ["bg-red-500","bg-red-500","bg-amber-500","bg-blue-500","bg-emerald-600"];
  const width = Math.max(0, Math.min(4, score)+1) * 20;
  return (<div className="space-y-2 mt-4">
    <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
      <div className={`h-2 ${colors[Math.max(0,Math.min(4,score))]}`} style={{ width: `${width}%` }}/>
    </div>
    <div className="text-sm text-slate-700">Độ mạnh: <b>{label}</b></div>
  </div>);
}
