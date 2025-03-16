import { FC, useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../types/types';

interface AutocompleteCountryProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  id: string;
  // setCountry: React.Dispatch<React.SetStateAction<string>>;
}

const AutocompleteCountry: FC<AutocompleteCountryProps> = ({
  value,
  onChange,
  error,
  id,
}) => {
  const countries = useSelector((state: RootState) => state.countries.list);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const filtered = countries.filter((country) =>
        country.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCountries(filtered.slice(0, 100));
    } else {
      setFilteredCountries([]);
    }
  }, [value, countries]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsOpen(true);
  };

  const selectCountry = (country: string) => {
    onChange(country);
    setIsOpen(false);
  };

  return (
    <div className="mb-4" ref={wrapperRef}>
      {/* <label htmlFor={id} className="block text-sm font-medium mb-1">
        Country
      </label> */}
      <div className="relative">
        <input
          type="text"
          id={id}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          className={`w-full p-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Start typing a country..."
        />

        {isOpen && filteredCountries.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
            {filteredCountries.map((country, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => selectCountry(country)}
              >
                {country}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default AutocompleteCountry;
