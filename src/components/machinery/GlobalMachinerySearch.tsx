"use client";

import { useState, type FocusEvent } from "react";
import { machineryCatalog } from "@/data/machinery";
import { useMachineryDirectory } from "./MachineryDirectory";
import "./global-machinery-search.css";

export default function GlobalMachinerySearch() {
  const { activateSearchResult, setSearchInteracting } = useMachineryDirectory();
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const results = normalizedQuery
    ? machineryCatalog.filter((machine) => machine.name.toLocaleLowerCase().includes(normalizedQuery))
    : [];

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setSearchInteracting(false);
  };

  return (
    <section className="machinery-finder" aria-labelledby="machinery-finder-heading">
      <div
        className="machinery-finder-inner"
        onFocusCapture={() => setSearchInteracting(true)}
        onBlurCapture={handleBlur}
      >
        <p id="machinery-finder-heading">MACHINERY FINDER</p>
        <div className="machinery-finder-control">
          <label htmlFor="global-machinery-search">SEARCH ALL MACHINERY</label>
          <div className="machinery-finder-field">
            <input
              id="global-machinery-search"
              type="search"
              value={query}
              placeholder="Search machine..."
              autoComplete="off"
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setQuery("");
                  setSearchInteracting(false);
                  event.currentTarget.blur();
                }
              }}
            />
            <span aria-hidden="true" />
          </div>
          {normalizedQuery ? (
            <div className="machinery-finder-results" aria-live="polite">
              {results.length ? results.map((machine) => (
                <button
                  key={machine.id}
                  type="button"
                  onClick={() => {
                    if (activateSearchResult(machine)) {
                      setQuery("");
                      setSearchInteracting(false);
                    }
                  }}
                >
                  <strong>{machine.name}</strong>
                  <span>{machine.category}</span>
                </button>
              )) : <p>NO MACHINERY FOUND</p>}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
