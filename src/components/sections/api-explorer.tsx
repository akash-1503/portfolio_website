"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Webhook, TerminalSquare, Copy, Check, Lock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const ENDPOINTS = [
  {
    id: "get-users",
    method: "GET",
    path: "/api/v1/users",
    description: "Retrieve a paginated list of registered users.",
    auth: "Bearer Token (Admin)",
    response: `{
  "data": [
    {
      "id": "usr_948jdh4",
      "email": "hello@example.com",
      "role": "ADMIN",
      "created_at": "2026-07-30T10:00:00Z"
    }
  ],
  "meta": { "page": 1, "total": 1402 }
}`
  },
  {
    id: "post-campaign",
    method: "POST",
    path: "/api/v1/campaigns",
    description: "Create a new fundraising campaign.",
    auth: "Bearer Token",
    response: `{
  "id": "cmp_847xyz",
  "title": "Clean Water Initiative",
  "goal_amount": 50000,
  "status": "DRAFT",
  "created_at": "2026-07-30T11:20:00Z"
}`
  },
  {
    id: "post-donation",
    method: "POST",
    path: "/api/v1/donations",
    description: "Process a new donation payment.",
    auth: "Public API Key",
    response: `{
  "id": "don_112abc",
  "amount": 100.00,
  "status": "SUCCESS",
  "receipt_url": "https://stripe.com/receipt/..."
}`
  }
];

const METHOD_COLORS = {
  GET: "text-blue-600 bg-blue-100 border-blue-200 dark:text-blue-400 dark:bg-blue-900/30 dark:border-blue-800",
  POST: "text-green-600 bg-green-100 border-green-200 dark:text-green-400 dark:bg-green-900/30 dark:border-green-800",
  PATCH: "text-orange-600 bg-orange-100 border-orange-200 dark:text-orange-400 dark:bg-orange-900/30 dark:border-orange-800",
  DELETE: "text-red-600 bg-red-100 border-red-200 dark:text-red-400 dark:bg-red-900/30 dark:border-red-800"
};

export function ApiExplorer() {
  const [activeEndpoint, setActiveEndpoint] = React.useState(ENDPOINTS[0]);
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(activeEndpoint.response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="api" className="py-24 bg-background relative">
      <div className="container px-4 mx-auto max-w-6xl">
        
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
            <Webhook className="w-4 h-4" /> API Documentation
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">API Explorer</h2>
          <p className="text-lg text-secondary-foreground max-w-2xl">
            Interactive RESTful API documentation. Explore standard request/response formats designed for the platform.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Endpoint List */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {ENDPOINTS.map((endpoint) => {
              const isActive = activeEndpoint.id === endpoint.id;
              return (
                <button
                  key={endpoint.id}
                  onClick={() => setActiveEndpoint(endpoint)}
                  className={cn(
                    "flex flex-col gap-2 p-5 rounded-2xl border transition-all duration-300 text-left",
                    isActive 
                      ? "bg-card border-primary shadow-[0_0_20px_rgba(255,122,89,0.15)] ring-1 ring-primary/20"
                      : "bg-card/50 border-border hover:bg-card hover:border-border/80 hover:shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-3 w-full">
                    <span className={cn("px-2 py-1 text-xs font-bold rounded-md border", METHOD_COLORS[endpoint.method as keyof typeof METHOD_COLORS])}>
                      {endpoint.method}
                    </span>
                    <span className={cn("font-mono text-sm truncate", isActive ? "text-foreground font-semibold" : "text-secondary-foreground")}>
                      {endpoint.path}
                    </span>
                  </div>
                  <p className="text-sm text-secondary-foreground mt-1 line-clamp-1">{endpoint.description}</p>
                </button>
              );
            })}
          </div>

          {/* Response Viewer */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeEndpoint.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0F172A] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col h-full"
              >
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#1E293B]">
                  <div className="flex items-center gap-2 text-slate-400">
                    <TerminalSquare className="w-5 h-5" />
                    <span className="text-sm font-mono tracking-wider text-slate-300">200 OK Response</span>
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="Copy JSON"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Info Bar */}
                <div className="flex items-center gap-6 px-6 py-3 bg-[#0F172A] border-b border-slate-800/50">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Lock className="w-3.5 h-3.5" /> {activeEndpoint.auth}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Globe className="w-3.5 h-3.5" /> application/json
                  </div>
                </div>

                {/* JSON Body */}
                <div className="p-6 overflow-x-auto">
                  <pre className="text-sm font-mono text-emerald-400 leading-relaxed">
                    <code>{activeEndpoint.response}</code>
                  </pre>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
