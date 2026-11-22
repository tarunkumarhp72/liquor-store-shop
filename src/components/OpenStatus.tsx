'use client';

import React, { useEffect, useState } from 'react';
import { STORE } from '@/lib/store';

function getStatus() {
  const hour = Number(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: STORE.timeZone,
      hour: 'numeric',
      hour12: false,
    }).format(new Date()),
  ) % 24;
  // Open 10 AM to 2 AM the next morning
  const open = hour >= STORE.openHour || hour < STORE.closeHour;
  return open
    ? { open: true, text: 'Open now, until 2 AM' }
    : { open: false, text: 'Closed now, opens at 10 AM' };
}

export default function OpenStatus() {
  const [status, setStatus] = useState<ReturnType<typeof getStatus> | null>(null);

  useEffect(() => {
    setStatus(getStatus());
    const id = setInterval(() => setStatus(getStatus()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Server render and first paint: neutral text, no flash of the wrong state
  if (!status) {
    return <span className="font-semibold text-cellar-charcoal">Open daily 10 AM – 2 AM</span>;
  }

  return (
    <span className="inline-flex items-center gap-2 font-semibold text-cellar-charcoal">
      <span
        className={`h-2 w-2 rounded-full ${status.open ? 'bg-emerald-600' : 'bg-stone-400'}`}
        aria-hidden="true"
      />
      {status.text}
    </span>
  );
}
