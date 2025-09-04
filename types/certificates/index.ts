import ORGANIZATION from "./organization";

interface CERTIFICATES {
  id: string;
  title: string;
  emission: Date;
  skills: string[];
  url?: string;
  organization: ORGANIZATION;
}
export default CERTIFICATES;
