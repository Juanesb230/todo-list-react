import { setupWorker } from 'msw'

import { handlers } from './serverHandlers'

const worker = setupWorker(...handlers)
export { worker }