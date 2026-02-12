import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { secret } from "@aws-amplify/backend";
export const groqKey = secret("GROQ_API_KEY");
defineBackend({
  auth,
  data,
});
