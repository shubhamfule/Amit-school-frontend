import { useEffect, useState } from "react";

export default function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        d.toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "short", year: "numeric" }) +
          "  ·  " +
          d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <div className="live-clock">{time}</div>;
}
