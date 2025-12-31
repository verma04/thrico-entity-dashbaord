import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { Input } from "@/components/ui/input";

// Declare Google Maps types
declare global {
  interface Window {
    google: any;
  }
}

export interface Location {
  name: string;
  latitude: number;
  longitude: number;
  address: string;
}

interface GooglePlacesInputProps
  extends Omit<React.ComponentProps<typeof Input>, "onChange" | "value"> {
  onChange: (location: Location) => void;
  initialValue?: Location | null;
}

export default function GooglePlacesInput({
  onChange,
  initialValue,
  placeholder = "Enter a location",
  className,
  ...props
}: GooglePlacesInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);
  const [value, setValue] = useState(initialValue?.name || "");

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (initialValue?.name) {
      setValue(initialValue.name);
    }
  }, [initialValue]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .pac-container {
        z-index: 10000 !important;
        pointer-events: auto !important;
        border-radius: 8px;
        margin-top: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        border: 1px solid #e5e7eb;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        console.log("Loading Google Maps Places library...");
        setOptions({
          key:
            process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
            "AIzaSyCJ2V6iHaVtyMC0zl0cBF6mktw3sdJblX4",
          v: "weekly",
        });

        // Load the places library
        const { Autocomplete } = (await importLibrary("places")) as any;

        if (!inputRef.current) {
          console.warn("Input ref not available for Google Places");
          return;
        }

        // Destroy existing autocomplete instance if it exists
        if (autocompleteRef.current && window.google?.maps?.event) {
          window.google.maps.event.clearInstanceListeners(
            autocompleteRef.current
          );
        }

        const autocomplete = new Autocomplete(inputRef.current, {
          fields: ["name", "formatted_address", "geometry", "place_id"],
          types: ["geocode"],
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          console.log("Google Place selection changed:", place);

          if (!place.geometry?.location) {
            console.warn("Selected place has no geometry data");
            return;
          }

          const location: Location = {
            name: place.name || place.formatted_address || "",
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
            address: place.formatted_address || "",
          };

          const newValue = place.formatted_address || place.name || "";
          console.log("Setting location value to:", newValue);
          setValue(newValue);
          onChangeRef.current(location);
        });

        autocompleteRef.current = autocomplete;
        console.log("Google Places autocomplete initialized successfully.");
      } catch (error) {
        console.error("Critical error loading Google Maps:", error);
      }
    };

    loadGoogleMaps();

    return () => {
      if (autocompleteRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, []);

  return (
    <Input
      type="text"
      ref={inputRef}
      value={value}
      onChange={(e) => {
        const newValue = e.target.value;
        setValue(newValue);
        // Also notify parent about the manual change
        onChangeRef.current({
          name: newValue,
          address: newValue,
          latitude: 0,
          longitude: 0,
        });
      }}
      placeholder={placeholder}
      className={cn("w-full", className)}
      {...props}
    />
  );
}
