"use client";

export function KontaktClient({ email }: { email: string }) {
  function mailTo() {
    window.location.href = `mailto:${email}?subject=Anmeldung%20Probetraining&body=Hallo%20Parkour%20Baar%2C%0D%0A%0D%0AIch%20m%C3%B6chte%20mich%20f%C3%BCr%20ein%20Probetraining%20anmelden.%0D%0A%0D%0AMit%20freundlichen%20Gr%C3%BCssen%2C%0D%0A[Dein%20Name]`;
  }

  return (
    <div className="bg-neutral-900 rounded-2xl p-10 flex flex-col justify-between min-h-[380px]">
      <div>
        <div className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-6">
          Einstieg
        </div>
        <h2 className="text-3xl font-black text-white leading-tight">
          Kostenlose
          <br />
          Probestunde
        </h2>
        <p className="mt-4 text-white/60 leading-relaxed">
          Komm einfach zu einem unserer Trainings vorbei. Schreib uns kurz eine
          E-Mail und wir bestätigen den Termin.
        </p>
      </div>
      <button
        onClick={mailTo}
        className="mt-8 w-full py-4 bg-white text-neutral-900 font-bold rounded-md hover:bg-neutral-100 transition-colors text-center"
      >
        E-Mail senden
      </button>
    </div>
  );
}
