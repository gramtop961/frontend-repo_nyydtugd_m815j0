import Spline from "@splinetool/react-spline";

export default function Hero() {
  return (
    <section className="relative min-h-[60vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/8p2v1fFQ9w2xV6k1/scene.splinecode"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/70 to-white pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-neutral-900">
            Hair-Formation
          </h1>
          <p className="mt-4 text-lg text-neutral-700">
            A modern barber scheduling experience — book seamlessly, manage
            appointments, and stay perfectly on time.
          </p>
          <div className="mt-8 flex gap-3">
            <a
              href="#book"
              className="px-5 py-3 rounded-lg bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors"
            >
              Book an Appointment
            </a>
            <a
              href="#appointments"
              className="px-5 py-3 rounded-lg bg-white text-neutral-900 font-medium border border-neutral-300 hover:bg-neutral-50 transition-colors"
            >
              View My Appointments
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
