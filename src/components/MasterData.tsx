import { Link } from "react-router-dom"

const MasterData = () => {
    return (
        <div>
            <div className="p-4">                
                <h2 className="text-3xl text-center font-bold mb-6">Master Data Configuration</h2>
                <div className="bg-base-200 rounded-lg shadow-lg p-4">
                    <div className="flex justify-center gap-6">
                        <Link to="/consultant-config">
                            <button className="btn btn-outline btn-primary">Doctors Configuration</button>
                        </Link>
                        <Link to="/consultant-slots/generate">
                            <button className="btn btn-outline btn-primary">Slot Configuration</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MasterData
