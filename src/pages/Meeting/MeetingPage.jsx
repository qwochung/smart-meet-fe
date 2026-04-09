import { useLocation } from 'react-router-dom';
import { MeetingEndedPage, MeetingRoomPage } from './index.js';

export default function MeetingPage() {
    const location = useLocation();

    if (location.pathname.endsWith('/summary')) {
        return <MeetingEndedPage />;
    }

    return <MeetingRoomPage />;
}