export function NexoMark({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M9 38V10h7l16 20V10h7v28h-7L16 18v20H9Z" fill="currentColor" /></svg>;
}

/** Original vector artwork: a connection hub, never a product screenshot or business metric. */
export function OrbitArtwork() {
  return <div className="orbit-artwork" aria-hidden="true">
    <svg viewBox="0 0 600 600" fill="none" className="orbit-canvas">
      <defs>
        <radialGradient id="nexo-core-light"><stop stopColor="#1b76e8" stopOpacity=".3"/><stop offset="1" stopColor="#1b76e8" stopOpacity="0"/></radialGradient>
        <linearGradient id="nexo-orbit-light" x1="80" y1="100" x2="490" y2="520" gradientUnits="userSpaceOnUse"><stop stopColor="#72ddff"/><stop offset=".5" stopColor="#2050a6" stopOpacity=".2"/><stop offset="1" stopColor="#4f9fff"/></linearGradient>
        <filter id="nexo-node-light" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5"/></filter>
      </defs>
      <circle cx="300" cy="300" r="285" fill="url(#nexo-core-light)"/>
      <g className="orbit-outer"><circle cx="300" cy="300" r="230" stroke="#193457" strokeDasharray="3 15"/><circle cx="300" cy="70" r="4" fill="#8edaff"/><circle cx="92" cy="398" r="3" fill="#8edaff"/></g>
      <g className="orbit-rings" stroke="url(#nexo-orbit-light)" strokeWidth="1.2">
        <ellipse cx="300" cy="300" rx="228" ry="106" transform="rotate(-33 300 300)"/>
        <ellipse cx="300" cy="300" rx="228" ry="106" transform="rotate(33 300 300)"/>
        <ellipse cx="300" cy="300" rx="123" ry="215" transform="rotate(8 300 300)"/>
        <circle cx="300" cy="300" r="166" strokeOpacity=".55"/>
      </g>
      <g className="orbit-connections" stroke="#377bd6" strokeOpacity=".6"><path d="m139 193 161 107 176-89M139 193l30 249 307-231-44 226L139 193Zm30 249 131-142 132 137"/></g>
      <g fill="#a9e7ff"><circle cx="139" cy="193" r="5"/><circle cx="476" cy="211" r="5"/><circle cx="169" cy="442" r="5"/><circle cx="432" cy="437" r="5"/></g>
      <g fill="#4da9ff" filter="url(#nexo-node-light)"><circle cx="139" cy="193" r="8"/><circle cx="476" cy="211" r="8"/><circle cx="169" cy="442" r="8"/><circle cx="432" cy="437" r="8"/></g>
      <circle cx="300" cy="300" r="65" fill="#0b1a30" stroke="#3b83ce"/>
      <path d="M273 328v-56h14l26 33v-33h14v56h-14l-26-33v33h-14Z" fill="#e4f4ff"/>
    </svg>
    <span className="orbit-label orbit-label-design">Diseño</span><span className="orbit-label orbit-label-code">Software</span><span className="orbit-label orbit-label-ai">Inteligencia artificial</span>
  </div>;
}

export function ConnectionArtwork() {
  return <div className="connection-artwork" aria-hidden="true"><svg viewBox="0 0 600 420" fill="none"><path d="M35 275C150 275 142 100 285 100s105 210 280 210" stroke="#203958" strokeWidth="2"/><path d="M35 275C150 275 142 100 285 100s105 210 280 210" stroke="#71cfff" strokeWidth="2" strokeDasharray="115 700" className="connection-pulse"/>{[[35,275],[160,171],[285,100],[419,222],[565,310]].map(([x,y])=><g key={x}><circle cx={x} cy={y} r="17" fill="#101f34"/><circle cx={x} cy={y} r="5" fill="#8adfff"/></g>)}</svg><span className="connection-word connection-word-start">Tu idea</span><span className="connection-word connection-word-end">Una solución real</span></div>;
}
