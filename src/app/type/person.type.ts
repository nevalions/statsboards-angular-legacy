export interface IPerson {
  id?: number | null;
  first_name?: string;
  second_name?: string;
  person_photo_url: string | null;
  person_dob: Date | null;
  person_eesl_id: number | null;
}
