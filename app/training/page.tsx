import { Navigation } from "@/components/Navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { getSiteData } from "@/utils/site-data";
import framePic from "@/public/pic_2.png";

export default async function TrainingPage() {
  const { training } = await getSiteData();

  return (
    <>
      <Navigation />

      <section className="pt-32 pb-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#566246] mb-4">
            Training
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-neutral-900 leading-none">
            So trainieren
            <br />
            wir.
          </h1>
          <p className="mt-6 text-lg text-neutral-600 max-w-xl leading-relaxed">
            Strukturierte Einheiten für alle Levels – von der ersten Rolle bis
            zum fortgeschrittenen Freestyle.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto relative h-72 md:h-[480px] rounded-2xl overflow-hidden">
          <Image
            src={framePic}
            alt="Parkour training"
            fill
            priority
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/2wBDAA4ODg4PDhASEhAXGBYYFyEfHBwfITIkJyQnJDJNMDgwMDgwTURSQz5DUkR6X1VVX3qMdnB2jKqYmKrWy9b/////2wBDAQ4ODg4PDhASEhAXGBYYFyEfHBwfITIkJyQnJDJNMDgwMDgwTURSQz5DUkR6X1VVX3qMdnB2jKqYmKrWy9b/////wgARCAC0AUADASIAAhEBAxEB/8QAGwAAAgMBAQEAAAAAAAAAAAAAAAIBAwQFBgf/xAAaAQEAAwEBAQAAAAAAAAAAAAAAAQIDBAUG/9oADAMBAAIQAxAAAAD2CO2uVJdCKi1pZxyYosuYzpqrkrLAubYtq46uhVeuZrltGfNdRrktbxpR3s053yr07c759NtGOtdGhL0zLpS9cxsaYwzupKXljZOZ+fa+zK0W1tjurNsBWWIYIkFpvWzOzUXpciJaDPGfbEpZdsixr4m3o49PL02JRFZYrLVlktFCEzXXRfO5E02qjCVnS+S/LW6UmtpJaJHV4lJsiJWZCITnnSWZtXPXqW9cVd+bfHOtkb43JJW2yabsdXtLMtELCtqUvJjNVpzaZ5o0LtlBL1lVZR804PM9Dp3+R73Zy9a3nW2rvsx3Y66Clq3eIUeizmS5u7xvIi/1DX5n1N88mbXT0c1WibzHZbi5Nuho478+3YjJd05uIWWQpCaXrGaHmK8u2q9MGnQs1+XT2uZxdubsce+1fU9Ty/permsexdM4sjRnospES3zD6P8AMM9qN2i6mn0FOFdamvn78NXS38Pqb4U5dlHgeir3xxdObbWdGV1av9R4tz0lLvVk0FsYLMdbKnw5a7Nei/K3gY7fitY6ANMbPY+Q9pamfTl2yq01ESnjvVtE+J4fteEv0uJVz8t+ts5zV06l3Imt+1PFlXT5ztPnfoRlyc8+t1+Z1eZv1LcGnq57LyfV42s4yHozzqVnvYKMdJ21U1xG3517rxHRS7Xydmle7diz1eg7ngPQHYbzPOh7bleewpZuXNujVh00RHRnnzW3RnnNnt0W50xPRbnSnpvzImnd5/P6zKNvBOe/rp8/2aUtmyMuZ6dVBXdDWmpwW8znznsZ6XxTLdGODoGCKtS0ErygKKN0ywR0YTz46Ic86Ac+d4YDoEThnaGL1HFlHd8tsky+t84Vn2LeNIe0TxweyfxRD1+fzBLJNc6VcQLIiQkkgAYUGhQaUJOKDChMpI0RAwoNKA4gWlcocVSyFBogJFYqaoibSuR5rkaIQsEkaIgYUJkgGUGgmQJI4gMASASkhJATKyRDQgmAhkiJJSSRAeGgraQkVhWAIJIVghoYVkCXrkmamGiYJlWFJCJgJZIHlHCICGSQQAgBnAqcIlkCYvzgPQBawCyAjgEgJaBNADACgDoBdITC0BE2KBqQJj//xAAtEAACAgEDBAIBBAICAwAAAAAAAQIRAwQSIQUTMUEQUTIUIkJhIFIVcQYjU//aAAgBAQABPwDamOBsNptspoaRtNnJTGhWhSOGTxpjwDxcC4FdiTJKh1ZLkrkWPiyETwqIwcpGHDRVE3fg2koklSFEcTts2CjQoiXzQkUSiJMSNqHElE2FFMcWU2h4yMKJE2xjKMUHJEMTZHAkRwxvwOoolbKNrHA7bYsTFCKGkScUeRuMULKd4WVMUkxP4aKK+WiiSocqE7+GSJMkMUbI42aZehQSOESlQ8huRvtiQ0vhknQ5lW7IxFCKfIoNnbFAcWvDIzkiMyyxSLRa+WSxpji0W6G2ZJyHJjbfxjolJGnolOje2O2bWxxdURhR4GxyRPIkPI2QuTOBkrEJiXxtRtaE38W0bl82N/DVkosaJQHBMlGmJEYRSsbtmPbCPkc7ZFCihxKHwNnBKSJcsURNJClY5UckcgpFliKEIpG1G0oyY3OPDpi1U9PPZqFx6kRlGcU4u18uCZkTRvonyxQbNskKMiEJiwysjBo2sr42nbJYrJ40mdp0dtnbYsdeRyVjdiwuzV5npVF+bMOpjlinFiykciFKxCRx/jn0+PUQcJoy583SJfue7EzH1nRzwPK50aTX6fWJ9qZyTZJEMe6SVD24+Ej8mJJIxuLVio4H82X8Sq/AojgjZRmbukKEmQxJeTTdT0+dKpJHWM0XKCsxZZ4ZboM0+phlS9MtojNojlQsllstljmkKdmt6rg0ipu5HUup5dbKnxE2Zcn7IW79H/jnT8mCMsmRU2NE0kOKqzHQ8akSjGBPLTpoeaSjwYdY7qiOpUuPZuL/AMLJN+iNljZss2JCcG6Uk2YIZYyVWdSz5rxpvlGm1z4jNEMvhxZpdddRyC5VoVkZM3z3UKcl5ZvTLiaicceDJJekarUPJlm2/Y5OzQTlj1WJ/wBkJ3BP+ieakZ8k5xbiLPlXs0meORcimjM5uVejZPlXZ2ppKiONp8xQ3KOROuCORSqmTbj7FlmRzfZ3UOZvZ3qHrMS8yHrr/DG2fqNVkkopxiPFOX55mafTYcMnOMm2zR7ZVvR1JRllSjEw4EyUZrLFRfAo/tRpY1hgmcDRiUm6aHiO20xSxbtu5bvo1ksUMM1OSSaMkV+olG7Vmq0EcOmhk9sT00cWGUZJzRj6pugkfqYSjTZp8kNrTJRjKc0n4MUXCuTHNV5MuaCu5JIx6jTSlUMkWyU4r2b0WmRSjbih21cmRg2rQscV+U0hy08PMzPrcGOqTZDJCUdy+hweWUnTMWkyc3Aej1WK2ldkNPrO43Lg0ulg4XN2xQhjnfpejFxEcYyu0LGoy4FG8hBXKKMWJLHD/ogrzyX0h400YU02n8ajKseKckraRi6d1LU6iWo7jhb4OsQ6hFRjkuS+0abS5s2aEVB3Zq9Mp6ZY8j8EcGOHEYkYShab4Mae3mZDUSx/zIazHHc2rbP1+Oq2n/IR8Lg6hOefA1jlyQx6zBNSW4jq59iLl5oh1JWkzDlU0mIyOU/2xRpVnjuhJqvRm001BTc/LMfTk0t8nyPp+iqpy4RiWjWRRg06JdmM7slrsK9oetWWE2n4JdTxQi1J2yHVcjT2QsnrtXk/o1ejxYME5r0hdQyRnTVqyE93JjdzMFd2F/ZjmnBc+jTPdlzS/svgjROdIc9xKcYQs13VsdbFFMeuyXaSRqeq5IcN2zFrsmTKkyUn9kZceTcjci18WRnQ2skdrJ9Pnw4zNLqJ6aO3L6I9VUpUlwR10DHq42mj9VF7U42jPrJzhtjCjfmdqvIozjyppFx/+zZkUEltY3iWGoy5FgwJ7nyx5KVRhQ5SdHWZ1pJIktrsx6uS4Zps+6dJCltaY+pZcaqzp3U1D9s/5My62EIkOoY+eSOtxZHW4nngmkpHVuoxhi7cHySztvyd20jUaNyxSzKRpl/7LHMWQ7h3RZTundFlFlMuol2XTOn6nBqsLx6j37M0ZaTK43cfTMep/shqP7MGqcX5MssmSTam0mQUoXU2zn7MMFsyFnJx20bmQdtJnW5XBRsy22zY1Fs0EZb7MuTbGyclONkJVJE8t4INyR+pwQb3SM2uW5bRa9+W3Zqc08rseQ7otXNQlC+GRko+DuiyndO6d07p3RZULKieW4tGOfZx+eTDu1uJQav+zU4c2jyVJcGPUmPUmkm8sXQ8c7/Fnbyf6sxY51Lh+DtZP9SOKTdJDx5djjtHhy7VUHZixZY5E3F0ZdZlzfnKzdH2i4NfiiGVQ8Iln3LlHd4pIjmUVxFEtQ5DlB/xHsf8T9n+opwi72GbFvk3FUfp8h2Mh2Mp2cp2cv0LFl+jt5fo2Zfo2Zfo25fo25fo25fo25fo7eWUlfg0Ov0+lxKCx2anXaPVRqeMzYnGb7fMTF3bVo0ev0mmxKO17vbF1nTsXVdM/YuraZeyXVcMkQ6pgij/AJbAPqcG3U0PqUm67iotm43G4sstlsstlss3G4ssssstls3Msss3G43G43G43m83m87h3DuG83lm4s8losbLFbKZFtHBZuFIssbL+LLL/wAL+LZfxZyWIfzZZaL44P3fRUjYbUUvhSGxSLLLLLLGWWKQ2/i/lFnPxfxf9liY3Y5FqiyxUxNF2cF/Db9lFpfDaEx2y6Hz4Ey2n8UJljZdnBdss/6GheBLnkv0OVFHo8IUhpIs98fEXwJl0WWOZ58FSEmfdsdehS4aYpWvAi18No9jlSOHR7Yviqr4RyXQ2qPo8yODdfx/Q+ODxw/i0XbOFwKKHtsdWSK4toTYnIe5mxi4Y2k/HxtYr8HN8CTY40vJfoqySoVNXZKj0I3cMUmNoS5uxvcJOrQtxu+0RVkrbFSY/JuG7Io2LyKh0mN8kb8juyq8ila8fG50JIcxv3RB8DQpUSdH8Tbb8knTpMc/TG0l+0tijJlbX4N0bLtlRryNPjaOkuRL6ZbF45FKSfgUpISvkkuSLRbZW51ZH8LE7sX5C8ssg2zLJ2R8WIg7kxpbRsm2o8DbHxQuWjJxJfDbVkFcScVsMfKMvHgg3tRJ+GZOGhcjXoumqE227GkkiU5KSKTjYuUPy0RnK2rLaIvkjFPkaSfB/8QAJBEAAgICAQQDAAMAAAAAAAAAAAECEQMSIQQQEzEiQVEFIGD/2gAIAQIBAT8Assss2E+yk0KRdkV2lKjypFuTE6FI3FNsbNYmqHGv6JipiiRgJDbJ25GpSH2jBjWp7HFldmWu1pdlIjbPrs0k3bGyy0RcRSQ3ESIZJ2vkyEoz9+x4xxZRRRWqIu0QkkSlzz6M/VxgqRDq1NpUyLUlaZXe2RlTtkstiXbFNvhlpmyHqSdNUy2vZ5E/RKm1y0yNuPLOozYozmknd8yHnz4ZWvTOl/kpQlUuEzHPFOCkpJ2iTxJ+zfFT5JZV9JIeS7+Q5WJp9k2i3Q2J2Mk3JCaUbPI07RLNOSpshrFNUSwxcdX+8C6TI8kk+Ir2zB1M+nmoxg/GLLsk0bIcvxjfN2eVfor4FZPa1Q5tJ8kZuuRTdjtxZfxoa+KNDVmrFEyRWvriyWD7QlOKaTHKf22fJqNWfNfYnO0Uu1I1j+FL8KX4UikUjVGqNUaocEzRDxQZ4IHggeCB4Yf5H//EACQRAAICAgICAgIDAAAAAAAAAAABAhEDEhAhE0EiMQQgUWBh/9oACAEDAQE/ACiuKK4aHEok+FGzxsqkMaNBxri2WxP9Hw2SkNiSIUojkWxcOaE74Ulyuab4aJUj3wm2voSKKZJMcWJMbJY4+4k4yj2voWQUkWWJj+VWTVMnFsjHrox4W3bHipD6L5pEo2qRHHQ3YzJBLtFNGrFsQ7ErHhkvsVpProl0+jFhnKKbFgxzXd2jN+FauJNZIzapoisrX0aZLI437bYoV6EqGuGrKXD6Em66IRUHTqxpuSjY8UJKmL8fEndEsd92W4yv/CWWKgmu2zJgjljbfyHCmasUT0VHhiqjVNlIjrastKUWV87sUqyN/wAo3RujdEpKi3HsWQy9q0fIp9CsTlf72y2WzZm8jeRvI2ZszeRvI8kjySPJL+o//9k="
            className="object-cover object-center"
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
          <div className="absolute inset-0 flex items-center px-10">
            <blockquote className="text-white max-w-sm">
              <p className="text-2xl md:text-3xl font-bold leading-snug">
                &ldquo;Be strong to be useful.&rdquo;
              </p>
              <cite className="mt-3 block text-sm text-white/60 not-italic">
                — Georges Hébert
              </cite>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#566246] mb-3">
              Wochenplan
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight">
              Trainingszeiten
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {training.sessions.map((s) => (
              <div
                key={s.id}
                className="bg-white border border-neutral-200 rounded-xl p-6 flex items-start justify-between gap-4 hover:border-neutral-400 transition-colors"
              >
                <div>
                  <div className="text-lg font-bold text-neutral-900">
                    {s.day}
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-500 mt-1 text-sm">
                    <Clock className="w-3.5 h-3.5" />
                    {s.time}
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">{s.note}</div>
                </div>
                <span className="shrink-0 text-xs font-semibold px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-full">
                  {s.level}
                </span>
              </div>
            ))}
          </div>
          <a
            href="https://maps.google.com/?q=Parkour+Baar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors w-fit"
          >
            <MapPin className="w-4 h-4 shrink-0 text-neutral-400" />
            {training.location}
          </a>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#566246] mb-3">
              Curriculum
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight">
              Was du lernst
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: "Absprung & Landung",
                desc: "Effektiv abspringen sowie präzis und sicher landen.",
              },
              {
                name: "Hindernisüberwindung",
                desc: "Unterschiedliche Hindernisse vielseitig und geschmeidig überwinden.",
              },
              {
                name: "Gleichgewicht",
                desc: "Den Körper in jeder Situation geschickt im Gleichgewicht halten.",
              },
              {
                name: "Schwingen",
                desc: "Unterschiedliche Objekte kreativ und zielorientiert zum Schwingen nutzen.",
              },
              {
                name: "Rollen & Drehen",
                desc: "Den eigenen Körper vielseitig und zielgerichtet rollen und drehen.",
              },
              {
                name: "Positionswechsel",
                desc: "Dynamisch zwischen hängender, stützender und stehender Position wechseln.",
              },
            ].map((t, i) => (
              <div
                key={t.name}
                className={`relative overflow-hidden rounded-2xl p-8 flex flex-col justify-between min-h-[180px] transition-all duration-300 ${
                  i === 0
                    ? "bg-neutral-900 text-white"
                    : i === 1
                      ? "bg-neutral-100 text-neutral-900"
                      : i === 2
                        ? "border-2 border-neutral-900 bg-white text-neutral-900"
                        : i === 3
                          ? "bg-[#566246] text-white"
                          : i === 4
                            ? "bg-neutral-200 text-neutral-900"
                            : "border-2 border-[#566246] bg-white text-neutral-900"
                }`}
              >
                <span
                  className={`absolute top-4 right-5 text-7xl font-black leading-none select-none pointer-events-none ${
                    i === 0
                      ? "text-white/10"
                      : i === 3
                        ? "text-white/15"
                        : "text-black/[0.06]"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative z-10">
                  <h3 className="font-black text-lg leading-tight mb-2">
                    {t.name}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${
                      i === 0 || i === 3 ? "text-white/60" : "text-neutral-500"
                    }`}
                  >
                    {t.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-neutral-900 rounded-2xl px-10 py-16 md:px-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Kostenlose Probestunde
              </h2>
              <p className="mt-3 text-white/60">
                Keine Vorkenntnisse erforderlich. Schreib uns kurz eine E-Mail
                und wir bestätigen den Termin.
              </p>
            </div>
            <Link
              href="/kontakt"
              className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-white text-neutral-900 font-bold rounded-md hover:bg-neutral-100 transition-colors"
            >
              Jetzt anmelden <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-neutral-200 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
          <span className="font-semibold text-neutral-900">Parkour Baar</span>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              Home
            </Link>
            <Link
              href="/kontakt"
              className="hover:text-neutral-900 transition-colors"
            >
              Kontakt
            </Link>
          </div>
          <span>© {new Date().getFullYear()} Parkour Baar</span>
        </div>
      </footer>
    </>
  );
}
