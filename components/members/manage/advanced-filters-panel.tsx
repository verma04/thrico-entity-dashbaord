"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "use-debounce";

// GraphQL Hooks
import { useGetUserLocationGraph } from "@/graphql/quries/location/location-queries";
import { 
  useSearchCompanies, 
  useSearchDegree, 
  useSearchFunctions, 
  useSearchInterests, 
  useSearchSkills 
} from "@/graphql/actions/commany";

interface AdvancedFiltersPanelProps {
  showFilters: boolean;
  hasActiveFilters: boolean;
  clearAllFilters: () => void;

  selectedLocations: string[];
  setSelectedLocations: (val: string[]) => void;

  selectedCompanies: string[];
  setSelectedCompanies: (val: string[]) => void;

  selectedColleges: string[];
  setSelectedColleges: (val: string[]) => void;

  selectedFunctions: string[];
  setSelectedFunctions: (val: string[]) => void;

  selectedInterests: string[];
  setSelectedInterests: (val: string[]) => void;

  selectedSkills: string[];
  setSelectedSkills: (val: string[]) => void;

  selectedIndustry?: string;
  setSelectedIndustry?: (val: string) => void;
  industries?: any[];
}

export function AdvancedFiltersPanel({
  showFilters,
  hasActiveFilters,
  clearAllFilters,
  selectedLocations,
  setSelectedLocations,
  selectedCompanies,
  setSelectedCompanies,
  selectedColleges,
  setSelectedColleges,
  selectedFunctions,
  setSelectedFunctions,
  selectedInterests,
  setSelectedInterests,
  selectedSkills,
  setSelectedSkills,
  selectedIndustry = "ALL",
  setSelectedIndustry,
  industries = [],
}: AdvancedFiltersPanelProps) {
  // Search states for each filter
  const [locSearch, setLocSearch] = useState("");
  const [compSearch, setCompSearch] = useState("");
  const [collSearch, setCollSearch] = useState("");
  const [intSearch, setIntSearch] = useState("");
  const [skillSearch, setSkillSearch] = useState("");
  const [funcSearch, setFuncSearch] = useState("");

  const [debouncedLocSearch] = useDebounce(locSearch, 300);
  const [debouncedCompSearch] = useDebounce(compSearch, 300);
  const [debouncedCollSearch] = useDebounce(collSearch, 300);
  const [debouncedIntSearch] = useDebounce(intSearch, 300);
  const [debouncedSkillSearch] = useDebounce(skillSearch, 300);
  // useGetFunctions does not support backend search natively, so we fetch all and filter locally
  const [debouncedFuncSearch] = useDebounce(funcSearch, 300);

  // Queries
  const { data: locationData, loading: locLoading } = useGetUserLocationGraph({
    variables: { search: debouncedLocSearch || null, limit: 50 },
    skip: !showFilters,
  });

  const { data: experienceData, loading: compLoading } =
    useSearchCompanies({
      variables: { input: { search: debouncedCompSearch || null, limit: 50 } },
      skip: !showFilters,
    });

  const { data: educationData, loading: collLoading } =
    useSearchDegree({
      variables: { input: { search: debouncedCollSearch || null, limit: 50 } },
      skip: !showFilters,
    });

  const { data: functionsData, loading: funcLoading } = 
    useSearchFunctions({
      variables: { input: { search: debouncedFuncSearch || null, limit: 50 } },
      skip: !showFilters,
    });

  const { data: interestsData, loading: intLoading } = useSearchInterests({
    variables: { input: { search: debouncedIntSearch || null, limit: 50 } },
    skip: !showFilters,
  });

  const { data: skillsData, loading: skillLoading } = useSearchSkills({
    variables: { input: { search: debouncedSkillSearch || null, limit: 50 } },
    skip: !showFilters,
  });

  // Derived options arrays
  const filterOptions = useMemo(() => {
    const locSet = new Set<string>();
    (locationData?.getUserLocationGraph || []).forEach((edge) => {
      if (edge.location?.title) locSet.add(edge.location.title);
    });

    const compSet = new Set<string>();
    (experienceData?.getSearchCompanies?.edges || []).forEach((edge: any) => {
      if (edge.node?.title) compSet.add(edge.node.title);
    });

    const collSet = new Set<string>();
    (educationData?.getSearchDegree?.edges || []).forEach((edge: any) => {
      if (edge.node?.title) collSet.add(edge.node.title);
    });

    const funcSet = new Set<string>();
    (functionsData?.getSearchFunctions?.edges || []).forEach((edge: any) => {
      if (edge.node?.title) funcSet.add(edge.node.title);
    });

    const intSet = new Set<string>();
    (interestsData?.getSearchInterests?.edges || []).forEach((edge: any) => {
      if (edge.node?.title) intSet.add(edge.node.title);
    });

    const skillSet = new Set<string>();
    (skillsData?.getSearchSkills?.edges || []).forEach((edge: any) => {
      if (edge.node?.title) skillSet.add(edge.node.title);
    });

    return {
      locations: Array.from(locSet).sort(),
      companies: Array.from(compSet).sort(),
      colleges: Array.from(collSet).sort(),
      functions: Array.from(funcSet).sort(),
      interests: Array.from(intSet).sort(),
      skills: Array.from(skillSet).sort(),
    };
  }, [
    locationData,
    experienceData,
    educationData,
    functionsData,
    interestsData,
    skillsData,
    debouncedFuncSearch,
  ]);

  return (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="mx-3 p-3 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Advanced Filters
              </span>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-5 px-2 text-[10px] font-semibold text-destructive hover:text-destructive gap-1"
                >
                  <X className="h-3 w-3" />
                  Clear All
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {setSelectedIndustry && (
                <Select
                  value={selectedIndustry}
                  onValueChange={setSelectedIndustry}
                >
                  <SelectTrigger className="w-[140px] h-7 rounded-md border-border bg-card text-[11px] font-semibold text-foreground shadow-none hover:bg-card focus:ring-2 focus:ring-ring/20">
                    <SelectValue placeholder="All Industries" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border shadow-lg p-1">
                    <SelectItem
                      value="ALL"
                      className="rounded-md text-[11px] font-semibold py-1"
                    >
                      All Industries
                    </SelectItem>
                    {industries.map((ind) => (
                      <SelectItem
                        key={ind.id}
                        value={ind.id}
                        className="rounded-md text-[11px] font-semibold py-1"
                      >
                        {ind.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <MultiSelect
                placeholder="All Locations"
                options={filterOptions.locations}
                selected={selectedLocations}
                onChange={setSelectedLocations}
                onSearchChange={setLocSearch}
                loading={locLoading}
              />

              <MultiSelect
                placeholder="All Companies"
                options={filterOptions.companies}
                selected={selectedCompanies}
                onChange={setSelectedCompanies}
                onSearchChange={setCompSearch}
                loading={compLoading}
              />

              <MultiSelect
                placeholder="All Colleges"
                options={filterOptions.colleges}
                selected={selectedColleges}
                onChange={setSelectedColleges}
                onSearchChange={setCollSearch}
                loading={collLoading}
              />

              <MultiSelect
                placeholder="All Functions"
                options={filterOptions.functions}
                selected={selectedFunctions}
                onChange={setSelectedFunctions}
                onSearchChange={setFuncSearch}
                loading={funcLoading}
              />

              <MultiSelect
                placeholder="All Interests"
                options={filterOptions.interests}
                selected={selectedInterests}
                onChange={setSelectedInterests}
                onSearchChange={setIntSearch}
                loading={intLoading}
              />

              <MultiSelect
                placeholder="All Skills"
                options={filterOptions.skills}
                selected={selectedSkills}
                onChange={setSelectedSkills}
                onSearchChange={setSkillSearch}
                loading={skillLoading}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
