

import { createContext } from 'react';

// Set initial values for context
export const DoctorContext = createContext({
    doctors: [],    // initially empty array
    loading: false, // loading state
    error: '',      // error message
    refetch: () => { } // refetch function, initially a no-op
});
