import { useState } from "react";
import type { Route } from "./+types/home";
import { motion } from "framer-motion";
import ContactForm from "~/components/ContactForm";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Parkour Baar" },
    { name: "description", content: "Willkommen bei Parkour Baar" },
  ];
}

export default function Home() {


  return (
    <>
      {/* Hero Section */}
      <section>
        <div className="relative w-full h-screen overflow-hidden">
          <motion.img
            src="app\assets\Home_picture.jpg"
            alt="Parkour"
            className="w-full h-full object-cover scale-105"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white drop-shadow-xl text-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
            >
              Parkour Baar
            </motion.h1>
          </div>
        </div>
      </section>

      {/* Middle Section */}
      <section className="bg-gradient-to-b from-white to-gray-100 py-16 sm:py-20 md:py-24 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Block 1 */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src="app\assets\Home_picture.jpg"
              alt=""
              className="rounded-3xl shadow-xl w-full h-auto object-cover transform hover:scale-105 transition duration-500"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Unsere Leidenschaft</h2>
            <p className="text-base sm:text-lg leading-relaxed text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt a ut suscipit facere voluptatum consectetur ratione quas possimus blanditiis sapiente voluptates enim reiciendis commodi assumenda recusandae, rem molestiae saepe? Quaerat? Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis aliquid, illum dolorum illo, officia incidunt porro ipsa repellendus numquam, aliquam debitis qui provident necessitatibus ipsum! Quae inventore tempore ad repellat.
            </p>
          </motion.div>

          {/* Block 2 */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-2 md:order-1 space-y-4"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">Die Community</h2>
            <p className="text-base sm:text-lg leading-relaxed text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque qui pariatur odit, itaque libero distinctio beatae ipsum ad dicta cupiditate corrupti minima modi aliquid porro a veritatis ex voluptatum sequi.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="order-1 md:order-2"
          >
            <img
              src="app\assets\Home_picture.jpg"
              alt=""
              className="rounded-3xl shadow-xl w-full h-auto object-cover transform hover:scale-105 transition duration-500"
            />
          </motion.div>
        </div>
      </section>

      {/* Über uns Section */}
      <section
        className="bg-gradient-to-b from-white to-gray-100 py-16 sm:py-20 md:py-24 px-4"
        id="ueber"
      >
        <div className="max-w-4xl mx-auto space-y-10">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-gray-800 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Über uns
          </motion.h2>

          <motion.div
            className="space-y-6 text-center text-gray-700 text-base sm:text-lg leading-relaxed"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p>
              Wir sind der <span className="font-semibold text-gray-900">Parkour Baar</span> – eine offene Gemeinschaft für alle, die Spaß an Bewegung, Herausforderung und Kreativität haben. Unser Ziel ist es, die Stadt als Spielplatz zu entdecken, neue Wege zu gehen und voneinander zu lernen – egal ob Anfänger oder Fortgeschrittene.
            </p>
            <p>
              Unser Training findet regelmäßig statt, damit jeder die Chance hat, sich zu verbessern, neue Tricks zu lernen und Teil unserer Community zu werden.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section
        className="bg-gradient-to-b from-gray-100 to-white py-16 sm:py-20 md:py-24 px-4"
        id="services"
      >
        <div className="max-w-4xl mx-auto space-y-10">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-gray-800 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Services
          </motion.h2>

          <motion.div
            className="space-y-6 text-center text-gray-700 text-base sm:text-lg leading-relaxed"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p>
              <span className="font-medium">Montag, 18:30 - 20:00 Uhr</span><br />
              📍 Turnhalle Baar oder je nach Wetter draußen im Ort
            </p>
            <p>
              Folge uns auf Instagram:{" "}
              <a
                href="https://instagram.com/parkourbaar"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-900"
              >
                @parkourbaar
              </a>
            </p>
          </motion.div>
        </div>
      </section>


      {/* Contact Section */}
      <ContactForm />




      {/* Bottom Section */}
      <section className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] bg-black flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e')] bg-cover bg-center opacity-30"
          initial={{ scale: 1.2 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 2 }}
        />
        <motion.h2
          className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-2xl text-center px-4"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Werde Teil der Bewegung
        </motion.h2>
      </section>
    </>
  );
}
