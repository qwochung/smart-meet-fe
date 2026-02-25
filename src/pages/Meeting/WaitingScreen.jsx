import {ArrowRight, Calendar, Camera, Clock, Clock2, LucideLink, Mic, Speaker, Video} from "lucide-react";
import {Link} from "react-router-dom";
import {Button} from "../../components/common/index.js";

export default function WaitingScreen() {

  return (
    <div className="bg-dark-900 overflow-hidden h-full text-white px-24 py-16  ">
      {/*TODO: Header here*/}

      {/*Body*/}
      <div className="flex flex-row">
        {/* Left side */}
        <div className="w-2/3">
          <p className="font-bold text-3xl py-2"> Ready to join ?</p>
          <p className="font-light text-lg text-gray-200">
            Check your audio and video before entering the call
          </p>

          <div className="w-11/12 h-4/5">
            <div className="w-full h-3/4 rounded-3xl overflow-hidden my-5">
              <img className=""
                   src="https://allprodad.com/wp-content/uploads/2021/03/05-12-21-happy-people.jpg" alt="aas"/>
            </div>

            <div className="w-full flex flex-row justify-center gap-5 pt-2">
              <button className="flex flex-col items-center">
                <div className="p-5 border rounded-full bg-gray-500/20 mb-3">
                  <Mic/>
                </div>
                Mic on
              </button>

              <button className="flex flex-col items-center">
                <div className="p-5 border rounded-full bg-gray-500/20 mb-3">
                  <Video/>
                </div>
                Cam on
              </button>


            </div>
          </div>

        </div>

        {/*  Right side */}
        <div className="w-2/5 bg-blue-950 rounded-xl p-10">

          <p className="text-primary-600 font-bold flex flex-row mb-5">
            <Calendar className="mr-2"/>
            MEETING DETAILS
          </p>

          {/* TODO: Input meeting name here.*/}
          <p className="text-4xl font-bold mb-5">
            Weekly Sync: Product Roadmap & Sprint Planning
          </p>

          <div className=" text-gray-400 flex flex-row gap-5">
            <div className="flex flex-row items-center gap-1">
              <Clock className="w-4 h-4"/>
              <span>10:00 AM - 11:00 AM</span>
            </div>

            <div className="flex flex-row items-center gap-1">
              <LucideLink className="w-4 h-4"/>
              <span>smart.meet/prod-sync</span>
            </div>
          </div>

          <div className="border-t my-10"></div>

          <span className="text-gray-400">
            John, Sarah, and 3 others are already here
          </span>

          {/* Avatar */}
          <div>
            <div className="flex items-center py-3">
              <img
                className="w-10 h-10 rounded-full border-2 border-dark-950 object-cover"
                src="https://img.freepik.com/free-photo/emotions-people-concept-headshot-serious-looking-handsome-man-with-beard-looking-confident-determined_1258-26730.jpg?semt=ais_hybrid&w=740&q=80"
                alt="user1"
              />

              <img
                className="w-10 h-10 rounded-full border-2 border-dark-950 object-cover -ml-2"
                src="https://img.freepik.com/free-photo/emotions-people-concept-headshot-serious-looking-handsome-man-with-beard-looking-confident-determined_1258-26730.jpg?semt=ais_hybrid&w=740&q=80"
                alt="user2"
              />

              <img
                className="w-10 h-10 rounded-full border-2 border-dark-950 object-cover -ml-2"
                src="https://img.freepik.com/free-photo/emotions-people-concept-headshot-serious-looking-handsome-man-with-beard-looking-confident-determined_1258-26730.jpg?semt=ais_hybrid&w=740&q=80"
                alt="user3"
              />

              <div
                className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-dark-950 bg-dark-800 text-xs font-medium text-gray-300 -ml-2">
                +2
              </div>
            </div>
          </div>

          {/*Device settings*/}
          <div>
            <div className="flex flex-row justify-between py-2">
              <span className="text-gray-400">Device settings</span>
              <button className="bg-none text-primary-600 hover:text-primary-700">
                Change
              </button>
            </div>

            <div className="bg-gray-700 opacity-60 p-5 rounded-xl flex flex-col gap-2 ">
              <div className="flex flex-row items-center gap-2">
                <Mic className="w-4 h-4"/>
                <span>MacBook Pro Microphone (Built-in)</span>
              </div>

              <div className="flex flex-row items-center gap-2">
                <Speaker className="w-4 h-4"/>
                <span>AirPods Pro (Bluetooth)</span>
              </div>
            </div>

            <Button className="w-full h-14 my-10 gap-2 text-xl font-extrabold">
              Join Now
              <ArrowRight strokeWidth={3}/>
            </Button>
          </div>

          <button className="w-full text-gray-400 hover:text-primary-600">
            Join with audio only
          </button>

        </div>

      </div>
    </div>
  )
}