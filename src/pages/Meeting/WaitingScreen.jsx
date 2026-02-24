export default function WaitingScreen() {

  return (
    <div className="bg-dark-900 overflow-hidden h-full text-white p-20  ">
      {/*TODO: Header here*/}

      {/*Body*/}
      <div className="flex flex-row">
        {/* Left side */}
        <div>
          <p className="font-bold text-3xl py-2"> Ready to join ?</p>

          <div className="w-3/5 rounded-3xl overflow-hidden">
            <img className=""
                 src="https://allprodad.com/wp-content/uploads/2021/03/05-12-21-happy-people.jpg" alt="aas"/>
          </div>
          
        </div>

        {/*  Right side */}
        <div>

        </div>

      </div>
    </div>
  )
}