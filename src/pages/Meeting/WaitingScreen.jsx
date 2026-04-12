import { ArrowRight, Calendar, Clock, Link as LinkIcon, Mic, MicOff, MonitorSpeaker, UsersRound, Video, VideoOff } from 'lucide-react';
import { Button } from '../../components/common/index.js';
import { useEffect, useRef, useState } from 'react';

export default function WaitingScreen() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  useEffect(() => {
    const openCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });

        setStream(mediaStream);
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
      } catch (err) {
        console.error('Loi truy cap camera:', err);
      }
    };

    openCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [stream]);

  const toggleCamera = async () => {
    if (!stream) return;
    if (isCamOn) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = false;
      });
      setIsCamOn(false);
    } else {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: isMicOn,
          video: true,
        });
        setStream(newStream);
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
        setIsCamOn(true);
      } catch (err) {
        console.error('Khong the mo camera:', err);
      }
    }
  };

  const toggleMic = () => {
    if (!stream) return;
    stream.getAudioTracks().forEach((track) => {
      track.enabled = !isMicOn;
    });
    setIsMicOn((prev) => !prev);
  };

  const people = [
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=200&q=80',
  ];

  return (
    <div className="min-h-full bg-slate-50 px-4 py-6 text-slate-900 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">Pre-join check</p>
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">Ready to join?</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
                Check your audio, camera, and device setup before entering the call.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Meeting code: <span className="font-semibold text-slate-900">smart.meet/prod-sync</span>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 text-sm text-slate-300">
                <span className="inline-flex items-center gap-2 font-medium text-white">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  Camera preview
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">Live devices connected</span>
              </div>

              <div className="h-[460px] bg-slate-900">
                {isCamOn ? (
                  <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-slate-400">
                    <div className="text-center">
                      <VideoOff className="mx-auto h-10 w-10" />
                      <p className="mt-3 text-sm">Camera is currently off</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-4 border-t border-white/10 bg-slate-900 px-5 py-5">
              <button
                type="button"
                onClick={toggleMic}
                className="group flex flex-col items-center text-xs text-slate-300"
              >
                <span className="mb-2 grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/5 transition-colors group-hover:bg-white/10">
                  {isMicOn ? <Mic className="h-5 w-5 text-white" /> : <MicOff className="h-5 w-5 text-rose-300" />}
                </span>
                {isMicOn ? 'Mic on' : 'Mic off'}
              </button>

              <button
                type="button"
                onClick={toggleCamera}
                className="group flex flex-col items-center text-xs text-slate-300"
              >
                <span className="mb-2 grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/5 transition-colors group-hover:bg-white/10">
                  {isCamOn ? <Video className="h-5 w-5 text-white" /> : <VideoOff className="h-5 w-5 text-rose-300" />}
                </span>
                {isCamOn ? 'Camera on' : 'Camera off'}
              </button>
              </div>
            </section>

            <aside className="space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="flex items-center gap-2 text-sm font-bold tracking-wide text-primary-600">
                  <Calendar className="h-4 w-4" />
                  MEETING DETAILS
                </p>

                <h2 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900">
                  Weekly Sync: Product Roadmap & Sprint Planning
                </h2>

                <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>10:00 AM - 11:00 AM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    <span>smart.meet/prod-sync</span>
                  </div>
                </div>

                <div className="my-8 border-t border-slate-200" />

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <UsersRound className="h-4 w-4" />
                  John, Sarah, and 3 others are already here
                </div>

                <div className="mt-4 flex items-center">
                  {people.map((person, index) => (
                    <img
                      key={person}
                      src={person}
                      alt="participant avatar"
                      className={`h-10 w-10 rounded-full border-2 border-white object-cover ${index === 0 ? '' : '-ml-2'}`}
                    />
                  ))}
                  <div className="-ml-2 grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-slate-200 text-xs font-semibold text-slate-700">
                    +2
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Device settings</span>
                  <button type="button" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                    Change
                  </button>
                </div>

                <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-slate-500" />
                    <span>MacBook Pro Microphone (Built-in)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MonitorSpeaker className="h-4 w-4 text-slate-500" />
                    <span>AirPods Pro (Bluetooth)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-slate-500" />
                    <span>MacBook Camera (Built-in)</span>
                  </div>
                </div>
              </div>

              <Button className="h-12 w-full text-base font-bold" icon={ArrowRight} iconPosition="right">
                Join now
              </Button>

              <button type="button" className="w-full text-center text-sm text-slate-600 hover:text-primary-600">
                Join with audio only
              </button>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}