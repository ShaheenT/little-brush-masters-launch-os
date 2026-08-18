"use client";

import {
  FormEvent,
  MouseEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";



import { AnimatePresence, motion } from "framer-motion";

import PaintbrushCursor from "./components/PaintbrushCursor";

import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Heart,
  Instagram,
  Music2,
  Paintbrush,
  Quote,
  Sparkles,
  Star,
  Volume2,
  VolumeX,
} from "lucide-react";

import { createLead } from "./lib/storage";
import type { Lead } from "./lib/types";

/* =========================================================
   CONFIGURATION
========================================================= */

const WHATSAPP_NUMBER = "27637545023";

const AUDIO_SOURCE = "/audio/einaudi.mp3";

const AUDIO_VOLUME = 0.2;

/* =========================================================
   PACKAGES
========================================================= */

const packages = [
  {
    id: "little_brush",
    name: "The Little Brush",
    price: "R6,850",
    note: "One feature wall",
    featured: false,
    items: [
      "Private 4-hour family experience",
      "Child-led creative concept",
      "Parent participation",
      "Professional mural execution",
      "Protective finishing",
      "Completion photographs",
    ],
  },
  {
    id: "signature_room",
    name: "The Signature Room",
    price: "R9,850",
    note: "Two-wall creative transformation",
    featured: true,
    items: [
      "Everything in The Little Brush",
      "Connected two-wall composition",
      "Personalised artwork details",
      "Premium finishing",
      "Memory photographs",
      "Digital keepsake",
    ],
  },
  {
    id: "childhood_project",
    name: "The Childhood Project",
    price: "R14,850",
    note: "Larger room transformation",
    featured: false,
    items: [
      "Bespoke room concept",
      "Multi-wall composition",
      "Child + parent participation",
      "Premium finishing",
      "Professional memory capture",
      "Personalised keepsake",
    ],
  },
];

/* =========================================================
   HERO ROTATION
========================================================= */

const rotatingWords = [
  "a memory",
  "an adventure",
  "their imagination",
  "a story",
];

/* =========================================================
   CHILDHOOD PROJECT STORIES

   Files:
   public/images/
========================================================= */

const stories = [
  {
    image: "/images/little_brush_masters_finished_sanctuary.png",
    alt: "A finished Little Brush Masters childhood sanctuary",
    label: "THE CHILDHOOD PROJECT",
  },
  {
    image: "/images/little_brush_masters_painting_experience.png",
    alt: "A Little Brush Masters family painting experience",
    label: "THE CREATIVE EXPERIENCE",
  },
  {
    image: "/images/little_brush_masters_palette_swatches.png",
    alt: "Little Brush Masters colour and material palette",
    label: "THE CREATIVE DIRECTION",
  },
  {
    image: "/images/little_brush_masters_sketch_concept.png",
    alt: "Little Brush Masters interior concept sketch",
    label: "THE CONCEPT",
  },
];

/* =========================================================
   TESTIMONIALS
========================================================= */

const testimonials = [
  {
    quote:
      "The experience became something much bigger than painting a wall. It became an afternoon our family will remember.",
    name: "Founding Family",
    location: "Cape Town",
  },
  {
    quote:
      "Our daughter chose the colours, helped create the idea and then watched her imagination come to life.",
    name: "Private Client",
    location: "Constantia",
  },
  {
    quote:
      "It feels completely different from hiring someone to paint a room. This is an experience.",
    name: "Founding Family",
    location: "Cape Town",
  },
];

/* =========================================================
   FAQ
========================================================= */

const faqs = [
  {
    question: "Does my child actually paint?",
    answer:
      "Yes. The experience is designed around participation. Your child helps shape the creative direction and takes part in the painting process, while our team guides the experience and completes the professional artwork.",
  },
  {
    question: "Do parents participate?",
    answer:
      "Absolutely. We encourage parents to participate because the shared experience is part of the value. You are not simply watching a room being painted — you are creating something together.",
  },
  {
    question: "Do you design the artwork?",
    answer:
      "Yes. Each project begins with a creative direction based around your child's interests, personality, existing room and the atmosphere you want to create.",
  },
  {
    question: "How long does the experience take?",
    answer:
      "Our standard private experience is approximately four hours. Larger or more detailed transformations may require additional time, which we will discuss during the consultation.",
  },
  {
    question: "Do you only work in Cape Town?",
    answer:
      "Little Brush Masters is currently focused on Cape Town and surrounding premium residential areas. Availability outside our standard service area can be discussed for selected projects.",
  },
];

/* =========================================================
   STORY COPY
========================================================= */

const storyCopy = [
  {
    eyebrow: "MORE THAN A WALL",
    title: "Start with their imagination.",
    copy:
      "We begin with the things your child loves — animals, space, sport, nature, stories, colours or simply the wild ideas inside their head.",
  },
  {
    eyebrow: "MAKE IT THEIRS",
    title: "Turn their ideas into something tangible.",
    copy:
      "The creative direction becomes a bespoke visual story designed specifically around their personality, interests and the room they call theirs.",
  },
  {
    eyebrow: "DESIGN THE FEELING",
    title: "Every colour has a reason.",
    copy:
      "We consider the room, the light, the existing interiors and the atmosphere you want to create — turning inspiration into a considered creative direction.",
  },
  {
    eyebrow: "KEEP THE MEMORY",
    title: "The wall becomes part of their childhood.",
    copy:
      "Years later, the artwork becomes more than decoration. It becomes a reminder of who they were, what they imagined and the afternoon you created together.",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function buildWhatsAppMessage(data: Record<string, string>) {
  return [
    "Hello Little Brush Masters! I'd like to request a Childhood Project.",
    "",
    `Parent: ${data.parent}`,
    `Child: ${data.child}`,
    `Child age: ${data.age}`,
    `Project: ${data.project}`,
    `Location: ${data.location}`,
    `Timing: ${data.timing}`,
    `What they love: ${data.loves}`,
    "",
    "Please send me the next steps.",
  ].join("\n");
}

function getPackageId(project: string): Lead["packageInterest"] {
  if (project.includes("R6,850")) {
    return "little_brush";
  }

  if (project.includes("R9,850")) {
    return "signature_room";
  }

  if (project.includes("R14,850")) {
    return "childhood_project";
  }

  return null;
}

/* =========================================================
   MAGNETIC BUTTON
========================================================= */

function MagneticButton({
  children,
  href,
  className = "",
}: {
  children: ReactNode;
  href: string;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  function handleMove(e: MouseEvent<HTMLAnchorElement>) {
    const element = ref.current;

    if (!element) return;

    const rect = element.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    element.style.transform = `
      translate(${x * 0.12}px, ${y * 0.12}px)
    `;
  }

  function handleLeave() {
    if (!ref.current) return;

    ref.current.style.transform = "translate(0, 0)";
  }

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`magneticButton ${className}`}
    >
      {children}
    </a>
  );
}

/* =========================================================
   TILT CARD
========================================================= */

function TiltCard({
  children,
  featured = false,
}: {
  children: ReactNode;
  featured?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const element = ref.current;

    if (!element) return;

    const rect = element.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = (y / rect.height - 0.5) * -6;
    const rotateY = (x / rect.width - 0.5) * 6;

    element.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-6px)
    `;

    element.style.setProperty("--mouse-x", `${x}px`);
    element.style.setProperty("--mouse-y", `${y}px`);
  }

  function handleLeave() {
    if (!ref.current) return;

    ref.current.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`tiltCard ${featured ? "featuredCard" : ""}`}
    >
      {children}
    </div>
  );
}

/* =========================================================
   HOME
========================================================= */

export default function Home() {
  const [submitted, setSubmitted] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [navVisible, setNavVisible] = useState(true);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [currentStory, setCurrentStory] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const lastScroll = useRef(0);
  const storyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* =======================================================
     HERO WORD ROTATION
  ======================================================= */

  useEffect(() => {
    const interval = window.setInterval(() => {
      setWordIndex(
        (current) =>
          (current + 1) % rotatingWords.length
      );
    }, 3200);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  /* =======================================================
     SMART NAVIGATION
  ======================================================= */

  useEffect(() => {
    function handleScroll() {
      const currentScroll = window.scrollY;

      if (currentScroll < 80) {
        setNavVisible(true);
        lastScroll.current = currentScroll;
        return;
      }

      if (currentScroll < lastScroll.current) {
        setNavVisible(true);
      } else if (
        currentScroll >
        lastScroll.current + 5
      ) {
        setNavVisible(false);
      }

      lastScroll.current = currentScroll;
    }

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  /* =======================================================
     STORY SYNCHRONISATION
  ======================================================= */

  useEffect(() => {
    function updateStory() {
      const elements =
        storyRefs.current.filter(
          (
            element
          ): element is HTMLDivElement =>
            element !== null
        );

      if (!elements.length) return;

      const viewportCentre =
        window.innerHeight / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      elements.forEach(
        (element, index) => {
          const rect =
            element.getBoundingClientRect();

          const elementCentre =
            rect.top + rect.height / 2;

          const distance = Math.abs(
            elementCentre -
              viewportCentre
          );

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        }
      );

      setCurrentStory(
        (previous) =>
          previous === closestIndex
            ? previous
            : closestIndex
      );
    }

    function handleScroll() {
      if (rafRef.current !== null) {
        cancelAnimationFrame(
          rafRef.current
        );
      }

      rafRef.current =
        requestAnimationFrame(
          updateStory
        );
    }

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      handleScroll
    );

    const initialFrame =
      requestAnimationFrame(
        updateStory
      );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );

      window.removeEventListener(
        "resize",
        handleScroll
      );

      cancelAnimationFrame(
        initialFrame
      );

      if (
        rafRef.current !== null
      ) {
        cancelAnimationFrame(
          rafRef.current
        );
      }
    };
  }, []);

  /* =======================================================
     PRELOAD STORY IMAGES
  ======================================================= */

  useEffect(() => {
    stories.forEach((story) => {
      const image =
        new Image();

      image.src =
        story.image;
    });
  }, []);

  /* =======================================================
     AUDIO INITIALISATION
  ======================================================= */

  useEffect(() => {
    const audio =
      audioRef.current;

    if (!audio) return;

    audio.volume =
      AUDIO_VOLUME;

    audio.loop = true;

    return () => {
      audio.pause();
    };
  }, []);

  /* =======================================================
     AUDIO CONTROL
  ======================================================= */

  useEffect(() => {
    const audio =
      audioRef.current;

    if (!audio) return;

    if (!audioEnabled) {
      audio.pause();
      return;
    }

    audio.volume =
      AUDIO_VOLUME;

    const playAudio =
      async () => {
        try {
          setAudioError(false);

          await audio.play();
        } catch {
          setAudioError(true);
          setAudioEnabled(false);
        }
      };

    void playAudio();
  }, [audioEnabled]);

  async function toggleAudio() {
    const audio =
      audioRef.current;

    if (!audio) return;

    if (audioEnabled) {
      audio.pause();
      setAudioEnabled(false);
      return;
    }

    try {
      audio.volume =
        AUDIO_VOLUME;

      await audio.play();

      setAudioEnabled(true);
      setAudioError(false);
    } catch {
      setAudioError(true);
      setAudioEnabled(false);
    }
  }

  /* =======================================================
     FORM SUBMIT
  ======================================================= */

  function submit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const form =
      e.currentTarget;

    const formData =
      new FormData(form);

    const data =
      Object.fromEntries(
        formData.entries()
      ) as Record<
        string,
        string
      >;

    createLead({
      parentName:
        data.parent,

      parentEmail:
        data.email,

      parentPhone:
        data.phone,

      childName:
        data.child,

      childAge:
        Number(data.age),

      location:
        data.location,

      packageInterest:
        getPackageId(
          data.project
        ),

      enquiryMessage:
        [
          `Preferred timing: ${data.timing}`,
          `What the child loves: ${data.loves}`,
          `Project interest: ${data.project}`,
        ].join("\n"),

      source:
        "website",

      status:
        "enquiry",
    });

    const url =
      `https://wa.me/${WHATSAPP_NUMBER}?text=` +
      encodeURIComponent(
        buildWhatsAppMessage(
          data
        )
      );

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

    setSubmitted(true);
  }

  /* =======================================================
     TESTIMONIAL CONTROLS
  ======================================================= */

  function nextTestimonial() {
    setTestimonialIndex(
      (current) =>
        (current + 1) %
        testimonials.length
    );
  }

  function previousTestimonial() {
    setTestimonialIndex(
      (current) =>
        (current -
          1 +
          testimonials.length) %
        testimonials.length
    );
  }

  return (
    <>
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #faf9f6;
          color: #202020;
        }

        * {
          box-sizing: border-box;
        }

        ::selection {
          background: #e9d8a6;
          color: #202020;
        }

        /* =====================================================
           PAGE
        ===================================================== */

        .page {
          position: relative;
          z-index: 2;

          min-height: 100vh;

          overflow-x: hidden;

          background: rgba(
            250,
            249,
            246,
            0.76
          );
        }

        /* =====================================================
           AMBIENT AUDIO
        ===================================================== */

        .ambientAudio {
          position: fixed;

          width: 1px;
          height: 1px;

          overflow: hidden;

          opacity: 0;

          pointer-events: none;
        }

        /* =====================================================
           NAVIGATION
        ===================================================== */

        .nav {
          position: fixed;

          top: 18px;
          left: 50%;

          z-index: 100;

          width: min(
            1180px,
            calc(100% - 32px)
          );

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding:
            12px
            14px
            12px
            18px;

          transform:
            translateX(-50%);

          border:
            1px solid
            rgba(
              255,
              255,
              255,
              0.7
            );

          border-radius: 999px;

          background:
            rgba(
              255,
              255,
              255,
              0.82
            );

          backdrop-filter:
            blur(20px);

          -webkit-backdrop-filter:
            blur(20px);

          box-shadow:
            0 10px 40px
            rgba(
              0,
              0,
              0,
              0.06
            );

          transition:
            transform
              0.45s
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              ),
            opacity
              0.35s
              ease;
        }

        .nav.hidden {
          transform:
            translate(
              -50%,
              -140%
            );

          opacity: 0;
        }

        .brand {
          display: flex;
          align-items: center;

          gap: 10px;

          color: #1e2a44;

          font-size: 13px;
          font-weight: 800;

          letter-spacing:
            0.12em;
        }

        .brandLogo {
          width: 100px;
          height: 100px;

          object-fit: contain;
        }

        .brandText span {
          font-weight: 400;
        }

        .navActions {
          display: flex;
          align-items: center;

          gap: 8px;
        }

        .soundButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          gap: 7px;

          min-height: 38px;

          padding:
            0 12px;

          border: 0;

          border-radius: 999px;

          background:
            transparent;

          color: #777;

          font-size: 9px;
          font-weight: 800;

          letter-spacing:
            0.12em;

          cursor: pointer;

          transition:
            color
              0.25s ease,
            background
              0.25s ease;
        }

        .soundButton:hover {
          color: #1e2a44;

          background:
            rgba(
              30,
              42,
              68,
              0.05
            );
        }

        .navCta {
          display: inline-flex;
          align-items: center;

          gap: 8px;

          padding:
            11px 17px;

          border-radius: 999px;

          background:
            #1e2a44;

          color: #fff;

          text-decoration: none;

          font-size: 13px;
          font-weight: 600;
        }

        /* =====================================================
           HERO
        ===================================================== */

        .hero {
          position: relative;

          min-height: 100vh;

          display: flex;
          align-items: center;
          justify-content: center;

          overflow: hidden;

          padding:
            140px 24px 100px;

          background:
            radial-gradient(
              circle at 20% 20%,
              rgba(
                222,
                239,
                219,
                0.76
              ),
              transparent 35%
            ),
            radial-gradient(
              circle at 80% 20%,
              rgba(
                243,
                224,
                175,
                0.55
              ),
              transparent 32%
            ),
            radial-gradient(
              circle at 50% 100%,
              rgba(
                222,
                217,
                238,
                0.45
              ),
              transparent 40%
            ),
            rgba(
              250,
              249,
              246,
              0.68
            );
        }

        .hero::before,
        .hero::after {
          content: "";

          position: absolute;

          width: 55vw;
          height: 55vw;

          border-radius: 50%;

          filter:
            blur(80px);

          opacity: 0.35;

          animation:
            aurora
            14s
            ease-in-out
            infinite
            alternate;

          pointer-events: none;
        }

        .hero::before {
          left: -20%;
          top: 10%;

          background:
            #dbe8d3;
        }

        .hero::after {
          right: -20%;
          bottom: 0;

          background:
            #eadab1;

          animation-delay:
            -5s;
        }

        @keyframes aurora {
          0% {
            transform:
              translate3d(
                0,
                0,
                0
              )
              scale(1);
          }

          50% {
            transform:
              translate3d(
                7%,
                -5%,
                0
              )
              scale(1.1);
          }

          100% {
            transform:
              translate3d(
                -5%,
                8%,
                0
              )
              scale(0.95);
          }
        }

        .heroInner {
          position: relative;

          z-index: 2;

          width:
            min(
              950px,
              100%
            );

          text-align: center;
        }

        .eyebrow {
          margin:
            0 0 18px;

          color:
            #a1833e;

          font-size: 11px;
          font-weight: 800;

          letter-spacing:
            0.2em;

          text-transform:
            uppercase;
        }

        .hero h1 {
          max-width:
            900px;

          margin:
            0 auto;

          font-family:
            Georgia,
            serif;

          font-size:
            clamp(
              46px,
              7vw,
              86px
            );

          font-weight: 400;

          line-height:
            0.98;

          letter-spacing:
            -0.045em;

          color:
            #1e2a44;
        }

        .rotatingWord {
          display: inline-block;

          min-width: 260px;

          color:
            #9b7a37;
        }

        .heroCopy {
          max-width:
            660px;

          margin:
            30px auto;

          color:
            #656565;

          font-size:
            18px;

          line-height:
            1.75;
        }

        .heroActions {
          display: flex;
          align-items: center;
          justify-content: center;

          gap: 18px;

          margin-top:
            34px;
        }

        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          gap: 10px;

          min-height:
            54px;

          padding:
            0 25px;

          border: 0;

          border-radius:
            999px;

          text-decoration:
            none;

          font-size: 14px;
          font-weight: 700;

          cursor: pointer;
        }

        .primary {
          background:
            #1e2a44;

          color: #fff;

          box-shadow:
            0 18px 40px
            rgba(
              30,
              42,
              68,
              0.18
            );
        }

        .secondary {
          background:
            #f1eee6;

          color:
            #1e2a44;
        }

        .magneticButton {
          transition:
            transform
              0.35s
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              ),
            box-shadow
              0.35s ease;
        }

        .magneticButton:hover {
          box-shadow:
            0 20px 45px
            rgba(
              30,
              42,
              68,
              0.2
            );
        }

        .textLink {
          color:
            #666;

          font-size:
            14px;

          text-decoration:
            underline;

          text-underline-offset:
            5px;
        }

        .trustRow {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;

          gap: 25px;

          margin-top:
            65px;

          padding-top:
            25px;

          border-top:
            1px solid
            rgba(
              0,
              0,
              0,
              0.08
            );

          color:
            #777;

          font-size:
            12px;
        }

        .trustRow span {
          display: flex;
          align-items: center;

          gap: 8px;
        }

        /* =====================================================
           GENERAL
        ===================================================== */

        .section {
          padding:
            120px 24px;
        }

        .statement {
          max-width:
            850px;

          margin:
            auto;

          padding:
            150px 24px;

          text-align:
            center;

          background:
            rgba(
              250,
              249,
              246,
              0.58
            );
        }

        .statement h2,
        .sectionHead h2,
        .requestCopy h2 {
          margin: 0;

          font-family:
            Georgia,
            serif;

          font-size:
            clamp(
              36px,
              5vw,
              58px
            );

          font-weight:
            400;

          line-height:
            1.05;

          letter-spacing:
            -0.035em;
        }

        .statement p:last-child {
          max-width:
            650px;

          margin:
            30px auto 0;

          color:
            #6d6d6d;

          line-height:
            1.8;
        }

        .sectionHead {
          max-width:
            850px;

          margin:
            0 auto 70px;

          text-align:
            center;
        }

        .sectionHead h2 {
          margin-bottom:
            24px;
        }

        .sectionHead p:last-child {
          color:
            #777;

          line-height:
            1.7;
        }

        /* =====================================================
           EXPERIENCE
        ===================================================== */

        .experience {
          background:
            rgba(
              242,
              240,
              234,
              0.78
            );
        }

        .timeline {
          position:
            relative;

          width:
            min(
              1000px,
              100%
            );

          margin:
            auto;
        }

        .timelineBeam {
          position:
            absolute;

          top: 0;
          bottom: 0;
          left: 20px;

          width: 1px;

          background:
            linear-gradient(
              to bottom,
              transparent,
              #c6a85b,
              transparent
            );
        }

        .timelineItem {
          position:
            relative;

          display:
            grid;

          grid-template-columns:
            60px 1fr;

          gap:
            35px;

          padding:
            40px 0;
        }

        .timelineNumber {
          position:
            relative;

          z-index:
            2;

          width:
            40px;

          height:
            40px;

          display:
            grid;

          place-items:
            center;

          border:
            1px solid
            #d6c9a8;

          border-radius:
            50%;

          background:
            #faf9f6;

          color:
            #a1833e;

          font-size:
            12px;

          font-weight:
            800;
        }

        .timelineItem h3 {
          margin:
            12px 0;

          font-family:
            Georgia,
            serif;

          font-size:
            30px;

          font-weight:
            400;
        }

        .timelineItem p {
          max-width:
            600px;

          color:
            #707070;

          line-height:
            1.75;
        }

        /* =====================================================
           DIFFERENCE
        ===================================================== */

        .difference {
          background:
            rgba(
              255,
              255,
              255,
              0.76
            );
        }

        .differenceGrid {
          width:
            min(
              1100px,
              100%
            );

          margin:
            auto;

          display:
            grid;

          grid-template-columns:
            repeat(
              3,
              1fr
            );

          gap:
            20px;
        }

        .differenceCard {
          padding:
            36px;

          border:
            1px solid
            #ebe8df;

          border-radius:
            26px;

          background:
            rgba(
              250,
              249,
              246,
              0.88
            );
        }

        .differenceIcon {
          width:
            48px;

          height:
            48px;

          display:
            grid;

          place-items:
            center;

          margin-bottom:
            25px;

          border-radius:
            50%;

          background:
            #eee7d5;

          color:
            #9b7a37;
        }

        .differenceCard h3 {
          margin:
            0 0 15px;

          font-family:
            Georgia,
            serif;

          font-size:
            28px;

          font-weight:
            400;
        }

        .differenceCard p {
          margin:
            0;

          color:
            #707070;

          line-height:
            1.75;
        }

        /* =====================================================
           PACKAGES
        ===================================================== */

        .packages {
          background:
            rgba(
              250,
              249,
              246,
              0.74
            );
        }

        .packageGrid {
          width:
            min(
              1150px,
              100%
            );

          margin:
            auto;

          display:
            grid;

          grid-template-columns:
            repeat(
              3,
              1fr
            );

          gap:
            20px;

          perspective:
            1000px;
        }

        .tiltCard {
          --mouse-x: 50%;
          --mouse-y: 50%;

          position:
            relative;

          overflow:
            hidden;

          padding:
            35px;

          border:
            1px solid
            #ebe8df;

          border-radius:
            28px;

          background:
            rgba(
              255,
              255,
              255,
              0.94
            );

          box-shadow:
            0 10px 35px
            rgba(
              0,
              0,
              0,
              0.035
            );

          transition:
            transform
              0.35s
              cubic-bezier(
                0.22,
                1,
                0.36,
                1
              ),
            box-shadow
              0.35s ease;
        }

        .tiltCard:hover {
          box-shadow:
            0 30px 70px
            rgba(
              0,
              0,
              0,
              0.1
            );
        }

        .spotlight {
          position:
            absolute;

          inset: 0;

          pointer-events:
            none;

          opacity: 0;

          background:
            radial-gradient(
              circle at
                var(--mouse-x)
                var(--mouse-y),
              rgba(
                212,
                175,
                55,
                0.18
              ),
              transparent 28%
            );

          transition:
            opacity
              0.3s ease;
        }

        .tiltCard:hover
        .spotlight {
          opacity:
            1;
        }

        .cardContent {
          position:
            relative;

          z-index:
            2;
        }

        .featuredCard {
          border-color:
            #c9aa61;

          transform:
            translateY(
              -15px
            );
        }

        .recommended {
          display:
            inline-block;

          margin-bottom:
            22px;

          padding:
            6px 10px;

          border-radius:
            999px;

          background:
            #1e2a44;

          color:
            #fff;

          font-size:
            9px;

          font-weight:
            800;

          letter-spacing:
            0.15em;
        }

        .packageName {
          color:
            #9b7a37;

          font-size:
            12px;

          font-weight:
            800;

          letter-spacing:
            0.12em;

          text-transform:
            uppercase;
        }

        .price {
          margin:
            10px 0;

          font-family:
            Georgia,
            serif;

          font-size:
            46px;
        }

        .packageNote {
          color:
            #777;

          font-size:
            13px;
        }

        .tiltCard ul {
          margin:
            28px 0;

          padding:
            0;

          list-style:
            none;
        }

        .tiltCard li {
          display:
            flex;

          gap:
            10px;

          padding:
            9px 0;

          color:
            #606060;

          font-size:
            13px;
        }

        .tiltCard li svg {
          flex-shrink:
            0;

          color:
            #a1833e;
        }

        /* =====================================================
           MARQUEE
        ===================================================== */

        .marquee {
          overflow:
            hidden;

          padding:
            28px 0;

          background:
            #1e2a44;

          color:
            #fff;
        }

        .marqueeTrack {
          display:
            flex;

          width:
            max-content;

          animation:
            marquee
            28s
            linear
            infinite;
        }

        .marqueeItem {
          padding:
            0 35px;

          font-size:
            11px;

          font-weight:
            700;

          letter-spacing:
            0.2em;

          text-transform:
            uppercase;

          opacity:
            0.75;
        }

        @keyframes marquee {
          from {
            transform:
              translateX(0);
          }

          to {
            transform:
              translateX(-50%);
          }
        }

        /* =====================================================
           STORY
        ===================================================== */

        .storySection {
          padding-top:
            150px;

          padding-bottom:
            150px;

          background:
            rgba(
              250,
              249,
              246,
              0.78
            );
        }

        .storyGrid {
          width:
            min(
              1150px,
              100%
            );

          margin:
            auto;

          display:
            grid;

          grid-template-columns:
            1fr 1fr;

          gap:
            90px;
        }

        .storyVisual {
          position:
            sticky;

          top:
            120px;

          height:
            560px;

          overflow:
            hidden;

          border-radius:
            30px;

          background:
            #f5f1e8;

          box-shadow:
            0 30px 80px
            rgba(
              0,
              0,
              0,
              0.08
            );
        }

        .storyVisual::before {
          content:
            "";

          position:
            absolute;

          inset:
            20px;

          z-index:
            3;

          border:
            1px solid
            rgba(
              161,
              131,
              62,
              0.22
            );

          border-radius:
            22px;

          pointer-events:
            none;
        }

        .storyImage {
          width:
            100%;

          height:
            100%;

          display:
            block;

          object-fit:
            cover;
        }

        .storyImageOverlay {
          position:
            absolute;

          inset:
            0;

          z-index:
            2;

          background:
            linear-gradient(
              to top,
              rgba(
                0,
                0,
                0,
                0.25
              ),
              transparent 40%
            );

          pointer-events:
            none;
        }

        .storyLabel {
          position:
            absolute;

          left:
            30px;

          bottom:
            30px;

          z-index:
            4;

          padding:
            10px 14px;

          border-radius:
            4px;

          background:
            rgba(
              248,
              245,
              239,
              0.9
            );

          color:
            #777;

          font-size:
            11px;

          letter-spacing:
            0.18em;

          text-transform:
            uppercase;

          backdrop-filter:
            blur(8px);
        }

        .storyCounter {
          position:
            absolute;

          right:
            30px;

          bottom:
            30px;

          z-index:
            4;

          color:
            rgba(
              255,
              255,
              255,
              0.9
            );

          font-size:
            11px;

          font-weight:
            700;

          letter-spacing:
            0.12em;
        }

        .storyProgress {
          position:
            absolute;

          left:
            30px;

          top:
            30px;

          z-index:
            5;

          display:
            flex;

          gap:
            6px;
        }

        .storyProgress button {
          width:
            28px;

          height:
            3px;

          padding:
            0;

          border:
            0;

          border-radius:
            999px;

          background:
            rgba(
              255,
              255,
              255,
              0.35
            );

          cursor:
            pointer;

          transition:
            width
              0.35s ease,
            background
              0.35s ease;
        }

        .storyProgress
        button.active {
          width:
            48px;

          background:
            #fff;
        }

        .storyCopy {
          padding:
            40px 0;
        }

        .storyBlock {
          min-height:
            70vh;

          display:
            flex;

          flex-direction:
            column;

          justify-content:
            center;

          opacity:
            0.42;

          transition:
            opacity
              0.45s ease,
            transform
              0.45s ease;
        }

        .storyBlock:hover {
          opacity:
            1;
        }

        .storyBlock h3 {
          margin:
            0 0 20px;

          font-family:
            Georgia,
            serif;

          font-size:
            42px;

          font-weight:
            400;

          line-height:
            1.08;

          letter-spacing:
            -0.03em;
        }

        .storyBlock p:not(.eyebrow) {
          max-width:
            500px;

          margin:
            0;

          color:
            #707070;

          line-height:
            1.8;
        }

        /* =====================================================
           QUOTE
        ===================================================== */

        .quote {
          padding:
            130px 24px;

          text-align:
            center;

          background:
            rgba(
              232,
              228,
              217,
              0.82
            );
        }

        .quoteInner {
          width:
            min(
              800px,
              100%
            );

          margin:
            auto;
        }

        .quoteIcon {
          color:
            #a1833e;
        }

        .testimonialQuote {
          min-height:
            160px;

          margin:
            25px 0;

          font-family:
            Georgia,
            serif;

          font-size:
            clamp(
              28px,
              4vw,
              45px
            );

          line-height:
            1.2;
        }

        .testimonialName {
          color:
            #777;

          font-size:
            13px;
        }

        .testimonialControls {
          display:
            flex;

          justify-content:
            center;

          gap:
            10px;

          margin-top:
            35px;
        }

        .testimonialControls button {
          width:
            42px;

          height:
            42px;

          display:
            grid;

          place-items:
            center;

          border:
            1px solid
            rgba(
              0,
              0,
              0,
              0.15
            );

          border-radius:
            50%;

          background:
            transparent;

          cursor:
            pointer;

          transition:
            background
              0.2s ease,
            transform
              0.2s ease;
        }

        .testimonialControls
        button:hover {
          background:
            rgba(
              255,
              255,
              255,
              0.5
            );

          transform:
            translateY(-2px);
        }

        /* =====================================================
           FAQ
        ===================================================== */

        .faqSection {
          background:
            rgba(
              255,
              255,
              255,
              0.78
            );
        }

        .faq {
          width:
            min(
              850px,
              100%
            );

          margin:
            auto;

          border-top:
            1px solid
            #e5e1d8;
        }

        .faqItem {
          border-bottom:
            1px solid
            #e5e1d8;
        }

        .faqButton {
          width:
            100%;

          display:
            flex;

          align-items:
            center;

          justify-content:
            space-between;

          gap:
            20px;

          padding:
            26px 0;

          border:
            0;

          background:
            transparent;

          color:
            #202020;

          text-align:
            left;

          font:
            inherit;

          font-size:
            16px;

          font-weight:
            600;

          cursor:
            pointer;
        }

        .faqAnswer {
          overflow:
            hidden;

          color:
            #707070;

          line-height:
            1.8;
        }

        .faqAnswerInner {
          padding:
            0 50px 28px 0;
        }

        /* =====================================================
           REQUEST
        ===================================================== */

        .request {
          width:
            min(
              1150px,
              100%
            );

          margin:
            auto;

          display:
            grid;

          grid-template-columns:
            0.8fr 1.2fr;

          gap:
            100px;

          background:
            rgba(
              250,
              249,
              246,
              0.78
            );
        }

        .requestCopy {
          position:
            sticky;

          top:
            130px;

          align-self:
            start;
        }

        .requestCopy h2 {
          margin-bottom:
            25px;
        }

        .requestCopy p {
          color:
            #707070;

          line-height:
            1.8;
        }

        .availability {
          display:
            flex;

          align-items:
            center;

          gap:
            10px;

          margin-top:
            30px;

          color:
            #555;

          font-size:
            13px;
        }

        .availability span {
          width:
            8px;

          height:
            8px;

          border-radius:
            50%;

          background:
            #86a77b;

          box-shadow:
            0 0 0 5px
            rgba(
              134,
              167,
              123,
              0.12
            );
        }

        .leadForm {
          display:
            grid;

          gap:
            18px;

          padding:
            35px;

          border:
            1px solid
            #ebe8df;

          border-radius:
            30px;

          background:
            rgba(
              255,
              255,
              255,
              0.95
            );

          box-shadow:
            0 25px 80px
            rgba(
              0,
              0,
              0,
              0.05
            );
        }

        .leadForm label {
          display:
            grid;

          gap:
            8px;

          color:
            #555;

          font-size:
            12px;

          font-weight:
            700;
        }

        .leadForm input,
        .leadForm select,
        .leadForm textarea {
          width:
            100%;

          padding:
            14px;

          outline:
            none;

          border:
            1px solid
            #e5e1d8;

          border-radius:
            12px;

          background:
            #faf9f6;

          color:
            #202020;

          font:
            inherit;

          font-size:
            14px;

          transition:
            border
              0.2s ease,
            box-shadow
              0.2s ease;
        }

        .leadForm textarea {
          resize:
            vertical;
        }

        .leadForm input:focus,
        .leadForm select:focus,
        .leadForm textarea:focus {
          border-color:
            #bda05b;

          box-shadow:
            0 0 0 4px
            rgba(
              189,
              160,
              91,
              0.1
            );
        }

        .full {
          width:
            100%;
        }

        .success {
          padding:
            15px;

          border-radius:
            12px;

          background:
            #eef5eb;

          color:
            #55704e;

          font-size:
            13px;

          line-height:
            1.6;
        }

        .leadForm small {
          color:
            #888;

          line-height:
            1.6;
        }

        .audioError {
          color:
            #9a6d3a;

          font-size:
            11px;

          line-height:
            1.5;
        }

        /* =====================================================
           FOOTER
        ===================================================== */

        footer {
          position:
            relative;

          z-index:
            2;

          padding:
            70px 24px;

          text-align:
            center;

          border-top:
            1px solid
            #e8e5dc;

          background:
            rgba(
              250,
              249,
              246,
              0.9
            );
        }

        footer .brand {
          justify-content:
            center;

          margin-bottom:
            18px;
        }

        footer p {
          color:
            #888;

          font-size:
            12px;
        }

        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 800px) {
          .nav {
            top:
              10px;

            width:
              calc(
                100% - 20px
              );
          }

          .brandText {
            display:
              none;
          }

          .navActions {
            gap:
              2px;
          }

          .soundButton {
            min-height:
              34px;

            padding:
              0 8px;

            font-size:
              8px;
          }

          .navCta {
            padding:
              10px 13px;

            font-size:
              11px;
          }

          .hero {
            min-height:
              90vh;

            padding-top:
              120px;
          }

          .hero h1 {
            font-size:
              48px;
          }

          .rotatingWord {
            min-width:
              0;
          }

          .heroActions {
            flex-direction:
              column;
          }

          .trustRow {
            gap:
              15px;
          }

          .section {
            padding:
              90px 20px;
          }

          .statement {
            padding:
              110px 20px;
          }

          .differenceGrid,
          .packageGrid {
            grid-template-columns:
              1fr;
          }

          .featuredCard {
            transform:
              none;
          }

          .storyGrid,
          .request {
            grid-template-columns:
              1fr;

            gap:
              40px;
          }

          .storyVisual,
          .requestCopy {
            position:
              relative;

            top:
              auto;
          }

          .storyVisual {
            height:
              390px;
          }

          .storyCopy {
            padding:
              0;
          }

          .storyBlock {
            min-height:
              auto;

            padding:
              75px 0;

            opacity:
              1;
          }

          .storyBlock h3 {
            font-size:
              36px;
          }

          .storyProgress {
            left:
              22px;

            top:
              22px;
          }

          .request {
            width:
              100%;
          }

          .timelineItem {
            gap:
              20px;
          }

          .leadForm {
            padding:
              22px;
          }
        }

        /* =====================================================
           ACCESSIBILITY
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration:
              0.01ms !important;

            animation-iteration-count:
              1 !important;

            scroll-behavior:
              auto !important;

            transition-duration:
              0.01ms !important;
          }
        }

        /* =====================================================
           TOUCH DEVICES
        ===================================================== */

        @media (pointer: coarse) {
          .magneticButton {
            transform:
              none !important;
          }

          .tiltCard {
            transform:
              none !important;
          }
        }
      `}</style>

      {/* =====================================================
          AUDIO
      ===================================================== */}

      <audio
        ref={audioRef}
        className="ambientAudio"
        loop
        preload="auto"
        aria-hidden="true"
      >
        <source
          src={AUDIO_SOURCE}
          type="audio/mpeg"
        />
      </audio>

      {/* =====================================================
          CUSTOM CURSOR
      ===================================================== */}

      <PaintbrushCursor />

      {/* =====================================================
          NAVIGATION
      ===================================================== */}

      <nav
        className={`nav ${
          !navVisible
            ? "hidden"
            : ""
        }`}
        aria-label="Main navigation"
      >
        <div className="brand">
          <img
            src="/images/lbm-logo.png"
            alt="Little Brush Masters"
            className="brandLogo"
          />

          <div className="brandText">
            LITTLE BRUSH{" "}
            <span>
              MASTERS
            </span>
          </div>
        </div>

        <div className="navActions">
          <button
            type="button"
            className="soundButton"
            onClick={
              toggleAudio
            }
            aria-label={
              audioEnabled
                ? "Turn music off"
                : "Turn music on"
            }
            aria-pressed={
              audioEnabled
            }
          >
            {audioEnabled ? (
              <Volume2
                size={14}
              />
            ) : (
              <VolumeX
                size={14}
              />
            )}

            <span>
              {audioEnabled
                ? "SOUND ON"
                : "SOUND OFF"}
            </span>
          </button>

          <MagneticButton
            href="#request"
            className="navCta"
          >
            Request a Childhood
            Project

            <ArrowRight
              size={15}
            />
          </MagneticButton>
        </div>
      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="hero"
        aria-labelledby="hero-heading"
      >
        <div className="heroInner">
          <motion.p
            className="eyebrow"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
          >
            THE CHILDHOOD PROJECT
            · CAPE TOWN
          </motion.p>

          <motion.h1
            id="hero-heading"
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.9,
              delay: 0.15,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
          >
            What if their room
            <br />
            could hold{" "}

            <AnimatePresence
              mode="wait"
            >
              <motion.span
                key={
                  rotatingWords[
                    wordIndex
                  ]
                }
                className="rotatingWord"
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -20,
                }}
                transition={{
                  duration: 0.45,
                }}
              >
                {
                  rotatingWords[
                    wordIndex
                  ]
                }
              </motion.span>
            </AnimatePresence>

            ?
          </motion.h1>

          <motion.p
            className="heroCopy"
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.35,
            }}
          >
            A private parent-and-child
            creative experience where
            your family creates
            something beautiful
            together — directly on
            your child&apos;s wall.
          </motion.p>

          <motion.div
            className="heroActions"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.5,
            }}
          >
            <MagneticButton
              href="#request"
              className="button primary"
            >
              Start Their Childhood
              Project

              <ArrowRight
                size={18}
              />
            </MagneticButton>

            <a
              className="textLink"
              href="#experience"
            >
              Discover the
              experience
            </a>
          </motion.div>

          <motion.div
            className="trustRow"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 1,
              delay: 0.8,
            }}
          >
            <span>
              <Clock3
                size={16}
              />

              Private 4-hour
              experience
            </span>

            <span>
              <Heart
                size={16}
              />

              Designed around
              your child
            </span>

            <span>
              <Sparkles
                size={16}
              />

              Limited monthly
              availability
            </span>
          </motion.div>

          {audioError && (
            <motion.p
              className="audioError"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
            >
              Music could not be
              started by the browser.
              Please try the sound
              control again.
            </motion.p>
          )}
        </div>
      </section>

      {/* =====================================================
          STATEMENT
      ===================================================== */}

      <section
        className="statement"
        aria-labelledby="statement-heading"
      >
        <motion.p
          className="eyebrow"
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
        >
          THE IDEA
        </motion.p>

        <motion.h2
          id="statement-heading"
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
          }}
        >
          Children may outgrow
          the room.
          <br />
          They won&apos;t outgrow
          the memory.
        </motion.h2>

        <motion.p
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.7,
            delay: 0.15,
          }}
        >
          The colours they chose.
          The afternoon they
          painted with you. The
          little imperfections that
          make it theirs. The wall
          becomes more than décor —
          it becomes a physical
          reminder of a moment you
          made together.
        </motion.p>
      </section>

      {/* =====================================================
          EXPERIENCE
      ===================================================== */}

      <section
        id="experience"
        className="section experience"
        aria-labelledby="experience-heading"
      >
        <div className="sectionHead">
          <p className="eyebrow">
            THE EXPERIENCE
          </p>

          <h2 id="experience-heading">
            One family. One room.
            <br />
            One unforgettable day.
          </h2>
        </div>

        <div className="timeline">
          <div
            className="timelineBeam"
            aria-hidden="true"
          />

          {[
            [
              "01",
              "Imagine",
              "We discover what your child loves and shape the creative direction together.",
            ],
            [
              "02",
              "Create",
              "The concept becomes a playful, personalised wall story designed specifically for the room.",
            ],
            [
              "03",
              "Paint",
              "Your child and parents participate while our team guides and completes the artwork.",
            ],
            [
              "04",
              "Remember",
              "The finished room is revealed, photographed and preserved as part of your family story.",
            ],
          ].map(
            ([
              number,
              title,
              copy,
            ]) => (
              <motion.div
                className="timelineItem"
                key={number}
                initial={{
                  opacity: 0,
                  x: 30,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                  margin:
                    "-100px",
                }}
                transition={{
                  duration: 0.7,
                }}
              >
                <div className="timelineNumber">
                  {number}
                </div>

                <div>
                  <Paintbrush
                    size={20}
                    color="#a1833e"
                    aria-hidden="true"
                  />

                  <h3>
                    {title}
                  </h3>

                  <p>
                    {copy}
                  </p>
                </div>
              </motion.div>
            )
          )}
        </div>
      </section>

      {/* =====================================================
          DIFFERENCE
      ===================================================== */}

      <section
        className="section difference"
        aria-labelledby="difference-heading"
      >
        <div className="sectionHead">
          <p className="eyebrow">
            WHY IT IS DIFFERENT
          </p>

          <h2 id="difference-heading">
            This isn&apos;t a
            painting service.
          </h2>

          <p>
            It is a carefully designed
            childhood experience —
            with the finished room
            becoming the physical
            reminder of it.
          </p>
        </div>

        <div className="differenceGrid">
          {[
            {
              icon: (
                <Heart
                  size={22}
                />
              ),
              title:
                "Child-led",
              copy:
                "The creative process begins with your child rather than a catalogue of generic designs.",
            },
            {
              icon: (
                <Sparkles
                  size={22}
                />
              ),
              title:
                "Bespoke",
              copy:
                "Every project is considered around the child, the room, the light and the family's vision.",
            },
            {
              icon: (
                <Star
                  size={22}
                />
              ),
              title:
                "Remembered",
              copy:
                "The finished artwork becomes a visual time capsule of who they were at this stage of childhood.",
            },
          ].map(
            (item) => (
              <motion.div
                key={
                  item.title
                }
                className="differenceCard"
                initial={{
                  opacity: 0,
                  y: 35,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.6,
                }}
              >
                <div className="differenceIcon">
                  {
                    item.icon
                  }
                </div>

                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.copy}
                </p>
              </motion.div>
            )
          )}
        </div>
      </section>

      {/* =====================================================
          MARQUEE
      ===================================================== */}

      <section
        className="marquee"
        aria-hidden="true"
      >
        <div className="marqueeTrack">
          {[
            ...Array(2),
          ].flatMap(
            (_, group) =>
              [
                "CHILD-LED CREATIVITY",
                "PRIVATE FAMILY EXPERIENCE",
                "BESPOKE ROOM STORIES",
                "PREMIUM FINISHING",
                "CHILDHOOD PROJECT",
                "CAPE TOWN",
              ].map(
                (
                  item,
                  index
                ) => (
                  <span
                    className="marqueeItem"
                    key={`${group}-${index}`}
                  >
                    {item} ·
                  </span>
                )
              )
          )}
        </div>
      </section>

      {/* =====================================================
          PACKAGES
      ===================================================== */}

      <section
        className="section packages"
        aria-labelledby="packages-heading"
      >
        <div className="sectionHead">
          <p className="eyebrow">
            PRIVATE EXPERIENCES
          </p>

          <h2 id="packages-heading">
            Choose the scale
            of the story.
          </h2>

          <p>
            We price the experience
            as a creative project, not
            as a painting labour rate.
          </p>
        </div>

        <div className="packageGrid">
          {packages.map(
            (pack, index) => (
              <motion.div
                key={pack.id}
                initial={{
                  opacity: 0,
                  y: 50,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  margin:
                    "-80px",
                }}
                transition={{
                  duration: 0.7,
                  delay:
                    index *
                    0.12,
                }}
              >
                <TiltCard
                  featured={
                    pack.featured
                  }
                >
                  <div
                    className="spotlight"
                    aria-hidden="true"
                  />

                  <div className="cardContent">
                    {pack.featured && (
                      <div className="recommended">
                        RECOMMENDED
                      </div>
                    )}

                    <p className="packageName">
                      {
                        pack.name
                      }
                    </p>

                    <div className="price">
                      {
                        pack.price
                      }
                    </div>

                    <p className="packageNote">
                      {
                        pack.note
                      }
                    </p>

                    <ul>
                      {pack.items.map(
                        (
                          item
                        ) => (
                          <li
                            key={
                              item
                            }
                          >
                            <Check
                              size={
                                16
                              }
                            />

                            {
                              item
                            }
                          </li>
                        )
                      )}
                    </ul>

                    <a
                      className="button secondary"
                      href="#request"
                    >
                      Request this
                      experience

                      <ArrowRight
                        size={
                          16
                        }
                      />
                    </a>
                  </div>
                </TiltCard>
              </motion.div>
            )
          )}
        </div>
      </section>

      {/* =====================================================
          CHILDHOOD PROJECT STORY
      ===================================================== */}

      <section
        className="section storySection"
        id="story"
        aria-labelledby="story-heading"
      >
        <div className="storyGrid">
          {/* STICKY VISUAL */}

          <div className="storyVisual">
            <div className="storyProgress">
              {stories.map(
                (
                  story,
                  index
                ) => (
                  <button
                    key={
                      story.image
                    }
                    type="button"
                    aria-label={`View story ${index + 1}`}
                    className={
                      currentStory ===
                      index
                        ? "active"
                        : ""
                    }
                    onClick={() => {
                      storyRefs.current[
                        index
                      ]?.scrollIntoView(
                        {
                          behavior:
                            "smooth",
                          block:
                            "center",
                        }
                      );
                    }}
                  />
                )
              )}
            </div>

            <AnimatePresence
              mode="wait"
            >
              <motion.img
                key={
                  stories[
                    currentStory
                  ].image
                }
                src={
                  stories[
                    currentStory
                  ].image
                }
                alt={
                  stories[
                    currentStory
                  ].alt
                }
                className="storyImage"
                initial={{
                  opacity: 0,
                  scale: 1.04,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.99,
                }}
                transition={{
                  duration: 0.65,
                  ease: [
                    0.22,
                    1,
                    0.36,
                    1,
                  ],
                }}
              />
            </AnimatePresence>

            <div
              className="storyImageOverlay"
              aria-hidden="true"
            />

            <div className="storyLabel">
              {
                stories[
                  currentStory
                ].label
              }
            </div>

            <div
              className="storyCounter"
              aria-live="polite"
            >
              {String(
                currentStory +
                  1
              ).padStart(
                2,
                "0"
              )}{" "}
              /{" "}
              {String(
                stories.length
              ).padStart(
                2,
                "0"
              )}
            </div>
          </div>

          {/* STORY COPY */}

          <div className="storyCopy">
            <h2
              id="story-heading"
              style={{
                position:
                  "absolute",
                width:
                  "1px",
                height:
                  "1px",
                padding:
                  "0",
                margin:
                  "-1px",
                overflow:
                  "hidden",
                clip:
                  "rect(0, 0, 0, 0)",
                whiteSpace:
                  "nowrap",
                border:
                  "0",
              }}
            >
              More than a wall
            </h2>

            {storyCopy.map(
              (
                story,
                index
              ) => (
                <div
                  key={
                    story.title
                  }
                  ref={(
                    element
                  ) => {
                    storyRefs.current[
                      index
                    ] =
                      element;
                  }}
                  data-story-index={
                    index
                  }
                  className="storyBlock"
                  style={{
                    opacity:
                      currentStory ===
                      index
                        ? 1
                        : undefined,

                    transform:
                      currentStory ===
                      index
                        ? "translateY(0)"
                        : undefined,
                  }}
                >
                  <p className="eyebrow">
                    {
                      story.eyebrow
                    }
                  </p>

                  <h3>
                    {
                      story.title
                    }
                  </h3>

                  <p>
                    {
                      story.copy
                    }
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          TESTIMONIAL
      ===================================================== */}

      <section
        className="quote"
        aria-labelledby="testimonial-heading"
      >
        <div className="quoteInner">
          <Quote
            className="quoteIcon"
            size={28}
            aria-hidden="true"
          />

          <h2
            id="testimonial-heading"
            style={{
              position:
                "absolute",
              width:
                "1px",
              height:
                "1px",
              padding:
                "0",
              margin:
                "-1px",
              overflow:
                "hidden",
              clip:
                "rect(0, 0, 0, 0)",
              whiteSpace:
                "nowrap",
              border:
                "0",
            }}
          >
            Family experiences
          </h2>

          <AnimatePresence
            mode="wait"
          >
            <motion.div
              key={
                testimonialIndex
              }
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                duration: 0.4,
              }}
            >
              <p className="testimonialQuote">
                “
                {
                  testimonials[
                    testimonialIndex
                  ].quote
                }
                ”
              </p>

              <span className="testimonialName">
                {
                  testimonials[
                    testimonialIndex
                  ].name
                }
                {" · "}
                {
                  testimonials[
                    testimonialIndex
                  ].location
                }
              </span>
            </motion.div>
          </AnimatePresence>

          <div className="testimonialControls">
            <button
              type="button"
              onClick={
                previousTestimonial
              }
              aria-label="Previous testimonial"
            >
              <ChevronLeft
                size={18}
              />
            </button>

            <button
              type="button"
              onClick={
                nextTestimonial
              }
              aria-label="Next testimonial"
            >
              <ChevronRight
                size={18}
              />
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          FAQ
      ===================================================== */}

      <section
        className="section faqSection"
        id="faq"
        aria-labelledby="faq-heading"
      >
        <div className="sectionHead">
          <p className="eyebrow">
            QUESTIONS
          </p>

          <h2 id="faq-heading">
            Before we create
            something together.
          </h2>

          <p>
            A few things parents
            usually want to know
            before starting their
            Childhood Project.
          </p>
        </div>

        <div className="faq">
          {faqs.map(
            (
              faq,
              index
            ) => {
              const isOpen =
                openFaq ===
                index;

              return (
                <div
                  className="faqItem"
                  key={
                    faq.question
                  }
                >
                  <button
                    type="button"
                    className="faqButton"
                    onClick={() =>
                      setOpenFaq(
                        isOpen
                          ? null
                          : index
                      )
                    }
                    aria-expanded={
                      isOpen
                    }
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span>
                      {
                        faq.question
                      }
                    </span>

                    <motion.span
                      animate={{
                        rotate:
                          isOpen
                            ? 180
                            : 0,
                      }}
                      aria-hidden="true"
                    >
                      <ChevronDown
                        size={
                          20
                        }
                      />
                    </motion.span>
                  </button>

                  <AnimatePresence
                    initial={
                      false
                    }
                  >
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${index}`}
                        className="faqAnswer"
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height:
                            "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration:
                            0.3,
                        }}
                      >
                        <div className="faqAnswerInner">
                          {
                            faq.answer
                          }
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }
          )}
        </div>
      </section>

      {/* =====================================================
          REQUEST
      ===================================================== */}

      <section
        className="section request"
        id="request"
        aria-labelledby="request-heading"
      >
        <div className="requestCopy">
          <p className="eyebrow">
            THE FIRST 10
          </p>

          <h2 id="request-heading">
            We&apos;re opening the
            first 10 Childhood
            Projects.
          </h2>

          <p>
            Tell us a little about
            your child and the room.
            We&apos;ll recommend the
            right experience, confirm
            availability and guide you
            through the next step.
          </p>

          <div className="availability">
            <span />
            Limited private bookings
            each month
          </div>
        </div>

        <form
          className="leadForm"
          onSubmit={submit}
        >
          <label>
            Parent / guardian name

            <input
              required
              name="parent"
              placeholder="Your name"
              autoComplete="name"
            />
          </label>

          <label>
            Email address

            <input
              required
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label>
            Mobile number

            <input
              required
              type="tel"
              name="phone"
              placeholder="+27..."
              autoComplete="tel"
            />
          </label>

          <label>
            Home / project location

            <input
              required
              name="location"
              placeholder="Cape Town suburb"
              autoComplete="street-address"
            />
          </label>

          <label>
            Child&apos;s name

            <input
              required
              name="child"
              placeholder="Child's name"
            />
          </label>

          <label>
            Child&apos;s age

            <select
              required
              name="age"
              defaultValue=""
            >
              <option
                value=""
                disabled
              >
                Select age
              </option>

              {Array.from(
                {
                  length: 9,
                },
                (
                  _,
                  index
                ) => (
                  <option
                    key={
                      index +
                      4
                    }
                    value={
                      index +
                      4
                    }
                  >
                    {index +
                      4}
                  </option>
                )
              )}
            </select>
          </label>

          <label>
            Project you&apos;re
            imagining

            <select
              required
              name="project"
              defaultValue=""
            >
              <option
                value=""
                disabled
              >
                Select an option
              </option>

              <option>
                One feature wall —
                R6,850
              </option>

              <option>
                Two-wall
                transformation —
                R9,850
              </option>

              <option>
                Larger room
                transformation —
                R14,850
              </option>

              <option>
                Not sure yet —
                recommend for me
              </option>
            </select>
          </label>

          <label>
            Preferred timing

            <input
              required
              name="timing"
              placeholder="e.g. September school holidays"
            />
          </label>

          <label>
            What does your child
            love?

            <textarea
              required
              name="loves"
              rows={4}
              placeholder="Animals, space, sport, stories, nature, colours, hobbies..."
            />
          </label>

          <button
            className="button primary full"
            type="submit"
          >
            Request Their
            Childhood Project

            <ArrowRight
              size={18}
            />
          </button>

          {submitted && (
            <p
              className="success"
              role="status"
              aria-live="polite"
            >
              Your enquiry has been
              saved and your WhatsApp
              message has been
              prepared. Send the
              WhatsApp message to
              complete your enquiry.
            </p>
          )}

          <small>
            By submitting, you are
            requesting a consultation.
            A booking is only confirmed
            once availability and
            payment terms are agreed.
          </small>
        </form>
      </section>

       {/* Floating WhatsApp */}
     <a
  href="https://wa.me/27637545023?text=Hi%20Little%20Brush%20Masters%2C%20I%27d%20love%20to%20find%20out%20more%20about%20creating%20a%20special%20childhood%20experience"
  className="floatingWhatsApp"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Chat with Little Brush Masters on WhatsApp"
>
  <span className="paintBlob paintBlobBack" aria-hidden="true" />
  <span className="paintBlob paintBlobMain" aria-hidden="true" />

  <svg
    className="whatsappIcon"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.53 0 .2 5.33.2 11.88c0 2.09.55 4.13 1.59 5.93L.1 24l6.34-1.66a11.86 11.86 0 0 0 5.64 1.43h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.23-6.15-3.45-8.41ZM12.09 21.8h-.01a9.88 9.88 0 0 1-5.03-1.38l-.36-.21-3.76.99 1-3.66-.23-.38a9.87 9.87 0 1 1 8.39 4.64Zm5.42-7.39c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.67-2.07-.18-.3-.02-.46.14-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.64-.93-2.24-.24-.59-.49-.51-.68-.52h-.58c-.2 0-.52.07-.8.37-.28.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.09 4.5.71.31 1.27.5 1.71.64.72.23 1.37.2 1.89.12.58-.09 1.78-.73 2.03-1.44.25-.71.25-1.32.17-1.44-.08-.12-.27-.2-.57-.35Z"
      fill="currentColor"
    />
  </svg>

  <span className="paintTail paintTailOne" aria-hidden="true" />
  <span className="paintTail paintTailTwo" aria-hidden="true" />
</a>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="siteFooter">
  <div className="footerInner">

    <div className="footerBrand">
      <div className="footerBrandLockup">
        <img
          src="/images/lbm-logo.png"
          alt="Little Brush Masters"
          className="footerMainLogo"
        />

        <div className="footerBrandName">
          LITTLE BRUSH
          <span>MASTERS</span>
        </div>
      </div>

      <p className="footerTagline">
        Creating moments children will remember
        <br />
        for a lifetime.
      </p>

      <div className="footerLocation">
        Cape Town · South Africa
      </div>
    </div>


    <div className="footerExperience">
      <span className="footerEyebrow">
        THE CHILDHOOD PROJECT
      </span>

      <p>
        A once-in-a-childhood experience
        <br />
        designed around their imagination.
      </p>

      <a
        href="#request"
        className="footerCta"
      >
        Create Their Experience
        <ArrowRight size={15} />
      </a>
    </div>


    <div className="footerContact">
      <span className="footerEyebrow">
        CONNECT
      </span>

      <a
        href="https://wa.me/27637545023"
        target="_blank"
        rel="noopener noreferrer"
      >
        WhatsApp
      </a>

      <a href="mailto:hello@littlebrushmasters.co.za">
        hello@littlebrushmasters.co.za
      </a>

      <a
        href="https://www.instagram.com/littlebrushmasters/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Instagram size={14} />
        @littlebrushmasters
      </a>
    </div>


    <div className="footerTrademark">
      <img
        src="/images/LittleMasterTM-logo.png"
        alt="Little Master trademark"
        className="trademarkLogo"
      />

      <p>
        A mark of creativity,
        <br />
        imagination & childhood.
      </p>
    </div>

  </div>


  <div className="footerBottom">
    <span>
      © {new Date().getFullYear()} Little Brush Masters.
      All rights reserved.
    </span>

    <span className="footerBottomCenter">
      CREATE · EXPRESS · SHINE
    </span>

    <span>
      Cape Town, South Africa
    </span>
  </div>
</footer>
    </>
  );
}