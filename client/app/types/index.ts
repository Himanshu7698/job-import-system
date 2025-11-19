export interface JobRawData {
  title: string;
  id: string;
  [key: string]: any; // if rawData contains dynamic fields
}

export interface JobGuid {
  _: string;
  isPermaLink: string;
}

export interface JobMediaContent {
  url: string;
  medium: string;
  [key: string]: any;
}

export interface JobDataType {
  _id: string;
  jobId: string;
  title: string;
  company: string;
  description: string;
  link: string;
  location: string;
  pubDate: string;
  createdAt: string;
  updatedAt: string;

  rawData: JobRawData;

  guid: JobGuid;

  "job_listing:company": string;
  "job_listing:job_type": string;
  "job_listing:location": string;

  "media:content": JobMediaContent;

  content: {
    encoded: string;
  };

  __v: number;
}
