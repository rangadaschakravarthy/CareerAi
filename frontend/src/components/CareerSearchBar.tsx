import React from "react";
import { Search } from "lucide-react";

interface Props {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

const CareerSearchBar: React.FC<Props> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <Search className="absolute left-4 text-base-content/40 w-6 h-6" />
        <input
          type="text"
          placeholder="Search for your dream career..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-base-100 border border-base-content/10 rounded-2xl shadow-lg focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all text-lg"
        />
      </div>
    </div>
  );
};

export default CareerSearchBar;
