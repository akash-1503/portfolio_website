"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Table, Key, Hash, AlignLeft, Calendar, Network, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type ColumnDef = {
  name: string;
  type: string;
  desc: string;
  pk?: boolean;
  unique?: boolean;
  fk?: string;
};

type TableDef = {
  description: string;
  columns: ColumnDef[];
  relations: string[];
};

const SCHEMA: Record<string, TableDef> = {
  users: {
    description: "Core user authentication and profile data",
    columns: [
      { name: "id", type: "uuid", pk: true, desc: "Primary key identifier" },
      { name: "email", type: "varchar(255)", unique: true, desc: "User email address" },
      { name: "password_hash", type: "varchar", desc: "Bcrypt hashed password" },
      { name: "role", type: "enum", desc: "ADMIN, USER, or VOLUNTEER" },
      { name: "created_at", type: "timestamp", desc: "Record creation time" }
    ],
    relations: ["campaigns", "donations"]
  },
  campaigns: {
    description: "NGO fundraising and awareness campaigns",
    columns: [
      { name: "id", type: "uuid", pk: true, desc: "Primary key identifier" },
      { name: "title", type: "varchar(100)", desc: "Campaign title" },
      { name: "goal_amount", type: "decimal", desc: "Fundraising target" },
      { name: "creator_id", type: "uuid", fk: "users.id", desc: "User who created the campaign" },
      { name: "status", type: "enum", desc: "DRAFT, ACTIVE, COMPLETED" }
    ],
    relations: ["users", "donations"]
  },
  donations: {
    description: "Transaction records for campaign contributions",
    columns: [
      { name: "id", type: "uuid", pk: true, desc: "Primary key identifier" },
      { name: "amount", type: "decimal", desc: "Donation amount" },
      { name: "donor_id", type: "uuid", fk: "users.id", desc: "User who made the donation (optional)" },
      { name: "campaign_id", type: "uuid", fk: "campaigns.id", desc: "Target campaign" },
      { name: "status", type: "enum", desc: "PENDING, SUCCESS, FAILED" },
      { name: "stripe_id", type: "varchar", unique: true, desc: "Stripe payment intent ID" }
    ],
    relations: ["users", "campaigns"]
  }
};

export function DatabaseExplorer() {
  const [activeTable, setActiveTable] = React.useState<string>("users");
  const [search, setSearch] = React.useState("");

  const tables = Object.keys(SCHEMA).filter(t => t.includes(search.toLowerCase()));

  return (
    <section id="database" className="py-24 bg-secondary/30 relative">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
              <Database className="w-4 h-4" /> Relational Modeling
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Database Explorer</h2>
            <p className="text-lg text-secondary-foreground max-w-2xl">
              Interactive schema visualization. Explore tables, relationships, and data types powering the backend infrastructure.
            </p>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-foreground" />
            <input 
              type="text"
              placeholder="Search tables..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-foreground placeholder-secondary-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Table List */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {tables.map(table => (
              <button
                key={table}
                onClick={() => setActiveTable(table)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 text-left",
                  activeTable === table 
                    ? "bg-card border-primary shadow-[0_0_20px_rgba(255,122,89,0.15)] ring-1 ring-primary/20"
                    : "bg-card/50 border-border hover:bg-card hover:border-border/80 hover:shadow-sm"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-xl",
                    activeTable === table ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"
                  )}>
                    <Table className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={cn("font-bold", activeTable === table ? "text-primary" : "text-foreground")}>
                      {table}
                    </h3>
                    <p className="text-xs text-secondary-foreground mt-0.5">
                      {SCHEMA[table as keyof typeof SCHEMA].columns.length} columns
                    </p>
                  </div>
                </div>
                <ChevronDown className={cn("w-5 h-5 transition-transform", activeTable === table ? "text-primary -rotate-90" : "text-border")} />
              </button>
            ))}
          </div>

          {/* Schema Details */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTable}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl"
              >
                <div className="p-6 border-b border-border bg-secondary/30">
                  <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                    {activeTable}
                  </h3>
                  <p className="text-secondary-foreground">
                    {SCHEMA[activeTable as keyof typeof SCHEMA].description}
                  </p>
                </div>

                <div className="p-0">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-secondary/50 text-secondary-foreground text-sm uppercase tracking-wider">
                        <th className="px-6 py-4 font-semibold">Column</th>
                        <th className="px-6 py-4 font-semibold">Type</th>
                        <th className="px-6 py-4 font-semibold">Attributes</th>
                        <th className="px-6 py-4 font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {SCHEMA[activeTable as keyof typeof SCHEMA].columns.map((col, idx) => (
                        <tr key={col.name} className="hover:bg-secondary/20 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {col.pk ? <Key className="w-4 h-4 text-primary" /> : <AlignLeft className="w-4 h-4 text-secondary-foreground" />}
                              <span className="font-semibold text-foreground">{col.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 rounded-md bg-secondary text-xs font-mono text-secondary-foreground border border-border">
                              {col.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex gap-2 flex-wrap">
                            {col.pk && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase border border-primary/20">PK</span>}
                            {col.fk && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 uppercase border border-purple-200">FK: {col.fk}</span>}
                            {col.unique && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase border border-blue-200">UNIQUE</span>}
                          </td>
                          <td className="px-6 py-4 text-sm text-secondary-foreground">
                            {col.desc}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="p-6 border-t border-border bg-secondary/30 flex items-center gap-4">
                  <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Network className="w-4 h-4" /> Relationships:
                  </span>
                  <div className="flex gap-2">
                    {SCHEMA[activeTable as keyof typeof SCHEMA].relations.map(rel => (
                      <span key={rel} className="px-3 py-1 rounded-full bg-card border border-border text-xs font-medium text-secondary-foreground hover:text-primary transition-colors cursor-pointer">
                        {rel}
                      </span>
                    ))}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
