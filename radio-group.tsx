@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 220 30% 5%;
    --foreground: 0 0% 98%;
    --card: 220 30% 8%;
    --card-foreground: 0 0% 98%;
    --popover: 220 30% 8%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 87% 51%;
    --primary-foreground: 0 0% 100%;
    --secondary: 217 91% 60%;
    --secondary-foreground: 0 0% 100%;
    --muted: 220 20% 15%;
    --muted-foreground: 220 10% 65%;
    --accent: 0 0% 100%;
    --accent-foreground: 220 30% 10%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 98%;
    --border: 220 20% 20%;
    --input: 220 20% 20%;
    --ring: 217 91% 60%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-[#0a0f1c] text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@layer utilities {
  .glassmorphic {
    @apply backdrop-blur-md bg-white/5 border border-white/10;
  }
  
  .glassmorphic-card {
    @apply glassmorphic rounded-xl shadow-2xl;
  }
  
  .glassmorphic-navy {
    @apply backdrop-blur-md bg-blue-950/40 border border-blue-500/20;
  }
  
  .glow-red {
    box-shadow: 0 0 20px rgba(220, 38, 38, 0.3),
                0 0 40px rgba(220, 38, 38, 0.2),
                0 0 60px rgba(220, 38, 38, 0.1);
  }
  
  .glow-blue {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3),
                0 0 40px rgba(59, 130, 246, 0.2),
                0 0 60px rgba(59, 130, 246, 0.1);
  }
  
  .glow-white {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2),
                0 0 40px rgba(255, 255, 255, 0.1),
                0 0 60px rgba(255, 255, 255, 0.05);
  }
  
  .text-glow-red {
    text-shadow: 0 0 10px rgba(220, 38, 38, 0.5),
                 0 0 20px rgba(220, 38, 38, 0.3);
  }
  
  .text-glow-blue {
    text-shadow: 0 0 10px rgba(59, 130, 246, 0.5),
                 0 0 20px rgba(59, 130, 246, 0.3);
  }
  
  .text-glow-white {
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5),
                 0 0 20px rgba(255, 255, 255, 0.3);
  }
  
  .gradient-usa {
    background: linear-gradient(135deg, #dc2626 0%, #ffffff 50%, #2563eb 100%);
  }
  
  .gradient-usa-text {
    background: linear-gradient(135deg, #dc2626 0%, #ffffff 40%, #2563eb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .stars-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Empty_Star.svg/3840px-Empty_Star.svg.png d='M30 5l2.47 7.6h7.98l-6.45 4.69 2.47 7.6L30 20.2l-6.47 4.69 2.47-7.6-6.45-4.69h7.98L30 5z' fill='%23ffffff' fill-opacity='0.03'/%3E%3C/svg%3E");
  }
  
  .stripes-pattern {
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 20px,
      rgba(220, 38, 38, 0.03) 20px,
      rgba(220, 38, 38, 0.03) 40px
    );
  }
}

/* Hide hydration errors */
[data-hydration-error] {
  display: none !important;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(10, 15, 28, 0.5);
}

::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.4);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.6);
}

/* Premium animations */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.shimmer {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.float {
  animation: float 3s ease-in-out infinite;
}
