import { useState } from "react"

export default function Dashboard({ onEditCommission }) {
  const [commissions] = useState([
    {
      id: 1,
      title: "RocketShip Art Piece",
      client: "DigitalPawz",
      type: "Full-Body",
      payment: "Paid",
      deadline: "10/18/2026",
      references: ["Image 1", "Image 2", "Image 3"],
    },
    {
      id: 2,
      title: "Bejoja Tato",
      client: "Bejoja",
      type: "YCH Sticker",
      payment: "Pending",
      deadline: "Not Specified",
      references: ["Image 1"],
    },
    {
      id: 3,
      title: "Aster Triangles",
      client: "HiAmPotato",
      type: "Half-Body",
      payment: "Overdue",
      deadline: "Not Specified",
      references: ["Image 1"],
    },
  ])

  return (
    <div className="dashboard">

      <div className="dashboard-title">
        <h1>Dashboard</h1>
      </div>

      <div className="dashboard-cards">

        {commissions.map((commission) => (
          <div className="dashboard-card" key={commission.id}>

            <div className="card-header">
              <h2>{commission.title}</h2>

              <button
                className="edit-commission"
                onClick={() => onEditCommission(commission)}
                title="Edit Commission"
              >
                ⚙
              </button>
            </div>

            <p className="commission-client">
              for {commission.client}
            </p>

            <div className="card-divider"></div>

            <div className="card-info">
              <strong>Commission Type:</strong>
              <span>{commission.type}</span>
            </div>

            <div className="card-info">
              <strong>Payment Status:</strong>

              <span>
                {commission.payment}
              </span>
            </div>

            <div className="references-section">

              <div className="references-title">
                <strong>References</strong>
                <span>▼</span>
              </div>

              <div className="reference-images">

                {commission.references.map((reference, index) => (
                  <div
                    className="reference-image"
                    key={index}
                  >
                    {reference}
                  </div>
                ))}

              </div>

            </div>

            <div className="deadline">
              Deadline: {commission.deadline}
            </div>

          </div>
        ))}

      </div>

    </div>
  )
}
