"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, Send, Loader2, CheckCircle, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
    reset();
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <section id="contact" className="py-24 relative min-h-screen bg-section overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-info/10 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-success/10 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="container px-4 mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-heading mb-6"
          >
            Let's Build Something Amazing Together
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-paragraph max-w-3xl text-lg md:text-xl leading-relaxed"
          >
            I'm always open to discussing software engineering opportunities, AI projects, full-stack development, internships, collaborations, and innovative ideas.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto mb-24">
          
          {/* Left Side - 3D Illustration & Social Cards */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="flex flex-col gap-8"
          >
            {/* 3D Illustration Area */}
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl bg-gradient-to-br from-card to-background border border-border shadow-sm flex items-center justify-center p-8 group overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(229,231,235,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(229,231,235,0.2)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50" />
              
              <img src="/3d_laptop.png" alt="Workstation" className="relative z-10 w-3/4 object-contain group-hover:scale-105 transition-transform duration-700 ease-out" />
              
              {/* Floating Tech Icons */}
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/4 left-1/4 w-12 h-12 bg-white rounded-2xl shadow-lg border border-border flex items-center justify-center z-20">
                <span className="text-xl font-bold text-info">Re</span>
              </motion.div>
              <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-1/4 left-1/3 w-10 h-10 bg-white rounded-xl shadow-lg border border-border flex items-center justify-center z-20">
                <span className="text-lg font-bold text-heading">Nx</span>
              </motion.div>
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute top-1/3 right-1/4 w-14 h-14 bg-white rounded-2xl shadow-lg border border-border flex items-center justify-center z-20">
                <span className="text-2xl font-bold text-success">Py</span>
              </motion.div>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} className="absolute bottom-1/3 right-1/3 w-12 h-12 bg-white rounded-2xl shadow-lg border border-border flex items-center justify-center z-20">
                <span className="text-lg font-bold text-[#512BD4]">.NET</span>
              </motion.div>
            </div>

            {/* Social Cards */}
            <div className="grid grid-cols-2 gap-4">
              <a href="https://github.com/akash-1503" target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-2xl p-[1px] bg-border hover:bg-gradient-to-br hover:from-gray-700 hover:to-gray-900 transition-colors">
                <div className="relative z-10 flex items-center gap-3 bg-card p-4 rounded-[calc(1rem-1px)] h-full group-hover:bg-transparent transition-colors duration-300">
                  <div className="p-2 rounded-full bg-gray-100 group-hover:bg-white/20 transition-colors">
                    <GithubIcon className="w-5 h-5 text-heading group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-heading group-hover:text-white transition-colors">GitHub</h4>
                    <p className="text-xs text-paragraph group-hover:text-gray-300 transition-colors">@akash-1503</p>
                  </div>
                </div>
              </a>

              <a href="https://www.linkedin.com/in/akash-dandale-309644263" target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-2xl p-[1px] bg-border hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-700 transition-colors">
                <div className="relative z-10 flex items-center gap-3 bg-card p-4 rounded-[calc(1rem-1px)] h-full group-hover:bg-transparent transition-colors duration-300">
                  <div className="p-2 rounded-full bg-blue-50 group-hover:bg-white/20 transition-colors">
                    <LinkedinIcon className="w-5 h-5 text-info group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-heading group-hover:text-white transition-colors">LinkedIn</h4>
                    <p className="text-xs text-paragraph group-hover:text-blue-100 transition-colors truncate">Connect with me</p>
                  </div>
                </div>
              </a>

              <a href="mailto:akashdandale123@gmail.com" className="group relative overflow-hidden rounded-2xl p-[1px] bg-border hover:bg-gradient-to-br hover:from-primary hover:to-primary-hover transition-colors">
                <div className="relative z-10 flex items-center gap-3 bg-card p-4 rounded-[calc(1rem-1px)] h-full group-hover:bg-transparent transition-colors duration-300">
                  <div className="p-2 rounded-full bg-orange-50 group-hover:bg-white/20 transition-colors">
                    <Mail className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-heading group-hover:text-white transition-colors">Email</h4>
                    <p className="text-xs text-paragraph group-hover:text-orange-100 transition-colors truncate">akashdandale123</p>
                  </div>
                </div>
              </a>

              <a href="tel:+918669238125" className="group relative overflow-hidden rounded-2xl p-[1px] bg-border hover:bg-gradient-to-br hover:from-success hover:to-emerald-600 transition-colors">
                <div className="relative z-10 flex items-center gap-3 bg-card p-4 rounded-[calc(1rem-1px)] h-full group-hover:bg-transparent transition-colors duration-300">
                  <div className="p-2 rounded-full bg-green-50 group-hover:bg-white/20 transition-colors">
                    <Phone className="w-5 h-5 text-success group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-heading group-hover:text-white transition-colors">Phone</h4>
                    <p className="text-xs text-paragraph group-hover:text-green-100 transition-colors truncate">+91 8669238125</p>
                  </div>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="bg-glass backdrop-blur-xl border border-glass-border p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden"
          >
            {/* Success Overlay */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-card/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
                >
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: "spring", damping: 15 }}
                    className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle className="w-10 h-10 text-success" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-heading mb-2">Message Sent!</h3>
                  <p className="text-paragraph">Thank you for reaching out. I'll get back to you as soon as possible.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-heading ml-1">Full Name</label>
                <input 
                  {...register("name")}
                  className={cn(
                    "w-full px-5 py-3 rounded-xl bg-card border text-heading placeholder-paragraph focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm",
                    errors.name ? "border-destructive focus:ring-destructive/20" : "border-border focus:ring-primary/20"
                  )}
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-destructive text-sm mt-1 ml-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-heading ml-1">Email Address</label>
                <input 
                  {...register("email")}
                  type="email"
                  className={cn(
                    "w-full px-5 py-3 rounded-xl bg-card border text-heading placeholder-paragraph focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm",
                    errors.email ? "border-destructive focus:ring-destructive/20" : "border-border focus:ring-primary/20"
                  )}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-destructive text-sm mt-1 ml-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-heading ml-1">Subject</label>
                <input 
                  {...register("subject")}
                  className={cn(
                    "w-full px-5 py-3 rounded-xl bg-card border text-heading placeholder-paragraph focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm",
                    errors.subject ? "border-destructive focus:ring-destructive/20" : "border-border focus:ring-primary/20"
                  )}
                  placeholder="Project Collaboration"
                />
                {errors.subject && <p className="text-destructive text-sm mt-1 ml-1">{errors.subject.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-heading ml-1">Message</label>
                <textarea 
                  {...register("message")}
                  rows={4}
                  className={cn(
                    "w-full px-5 py-3 rounded-xl bg-card border text-heading placeholder-paragraph focus:outline-none focus:ring-2 focus:border-transparent transition-all shadow-sm resize-none",
                    errors.message ? "border-destructive focus:ring-destructive/20" : "border-border focus:ring-primary/20"
                  )}
                  placeholder="Tell me about your project..."
                />
                {errors.message && <p className="text-destructive text-sm mt-1 ml-1">{errors.message.message}</p>}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-3xl p-10 md:p-16 border border-border shadow-lg text-center max-w-5xl mx-auto"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-heading mb-6">Ready to Build Something Great?</h3>
          <p className="text-paragraph max-w-2xl mx-auto mb-10 text-lg">
            Whether it's a Full Stack Application, AI Project, .NET Solution, Backend Development, or an exciting collaboration, I'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 rounded-full bg-primary text-white font-bold hover:bg-primary-hover transition-colors shadow-md hover:shadow-primary/30 w-full sm:w-auto flex items-center justify-center gap-2">
              Send Message <Mail className="w-4 h-4" />
            </button>
            <a href="/resume.pdf" target="_blank" className="px-8 py-4 rounded-full bg-white text-heading font-bold border border-border hover:bg-section transition-colors shadow-sm w-full sm:w-auto flex items-center justify-center gap-2">
              Download Resume
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
