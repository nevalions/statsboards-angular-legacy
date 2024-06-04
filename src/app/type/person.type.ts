export interface IPerson {
  id?: number | null;
  first_name: string;
  second_name: string;
  person_photo_url: string | null;
  person_photo_icon_url: string | null;
  person_photo_web_url: string | null;
  person_dob: Date | null;
  person_eesl_id: number | null;
}

export interface AgeStats {
  average: number;
  min: { years: number; days: number };
  max: { years: number; days: number };
  median: number;
  minPlayer: { age?: number | null; first_name?: string; second_name?: string };
  maxPlayer: { age?: number | null; first_name?: string; second_name?: string };
}
