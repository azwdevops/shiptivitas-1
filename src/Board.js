import React from "react";
import Dragula from "dragula";
import "dragula/dist/dragula.css";
import Swimlane from "./Swimlane";
import "./Board.css";

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients();
    this.state = {
      clients: {
        backlog: clients.map((client) => ({ ...client, status: "backlog" })),
        inProgress: [],
        complete: [],
      },
    };
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    };
  }

  componentDidMount() {
    const drake = Dragula([this.swimlanes.backlog.current, this.swimlanes.inProgress.current, this.swimlanes.complete.current]);

    drake.on("drop", (el, target, source, sibling) => {
      const cardId = el.getAttribute("data-id");
      let newStatus;

      // determine the new status based on which swimlane it was dropped into

      if (target === this.swimlanes.backlog.current) {
        newStatus = "backlog";
      } else if (target === this.swimlanes.inProgress.current) {
        newStatus = "in-progress";
      } else if (target === this.swimlanes.complete.current) {
        newStatus = "complete";
      }
      if (!newStatus) return;

      // below we prevent Dragula from moving the element manually to avoid Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.
      drake.cancel(true);

      // move the card in state
      this.setState((prevState) => {
        const allClients = [...prevState.clients.backlog, ...prevState.clients.inProgress, ...prevState.clients.complete];

        // find the moved client
        const movedClient = allClients.find((client) => client.id === cardId);

        if (!movedClient) return null;

        // remove client first
        const updatedClients = allClients.filter((client) => client.id !== cardId);

        //update the status of the moved client
        movedClient.status = newStatus;

        // find where to insert based on sibling
        const siblingId = sibling ? sibling.getAttribute("data-id") : null;

        // we build new lists
        const newBacklog = [];
        const newInProgress = [];
        const newComplete = [];

        // create new swimlanes based on status
        updatedClients.forEach((client) => {
          if (client.status === "backlog" || !client.status) {
            newBacklog.push(client);
          } else if (client.status === "in-progress") {
            newInProgress.push(client);
          } else if (client.status === "complete") {
            newComplete.push(client);
          }
        });

        // helper to insert client at correct spot
        const insertClient = (list, clientToInsert) => {
          if (siblingId) {
            const index = list.findIndex((client) => client.id === siblingId);

            if (index >= 0) {
              list.splice(index, 0, clientToInsert); // insert before the sibling
            } else {
              list.push(clientToInsert); // if no sibling, insert at the end
            }
          } else {
            list.push(clientToInsert); // no sibling, insert at the end
          }
        };

        // insert moved client into correct list
        if (newStatus === "backlog") {
          insertClient(newBacklog, movedClient);
        } else if (newStatus === "in-progress") {
          insertClient(newInProgress, movedClient);
        } else if (newStatus === "complete") {
          insertClient(newComplete, movedClient);
        }

        return {
          clients: {
            backlog: newBacklog,
            inProgress: newInProgress,
            complete: newComplete,
          },
        };
      });
    });
  }

  getClients() {
    return [
      ["1", "Stark, White and Abbott", "Cloned Optimal Architecture", "in-progress"],
      ["2", "Wiza LLC", "Exclusive Bandwidth-Monitored Implementation", "complete"],
      ["3", "Nolan LLC", "Vision-Oriented 4Thgeneration Graphicaluserinterface", "backlog"],
      ["4", "Thompson PLC", "Streamlined Regional Knowledgeuser", "in-progress"],
      ["5", "Walker-Williamson", "Team-Oriented 6Thgeneration Matrix", "in-progress"],
      ["6", "Boehm and Sons", "Automated Systematic Paradigm", "backlog"],
      ["7", "Runolfsson, Hegmann and Block", "Integrated Transitional Strategy", "backlog"],
      ["8", "Schumm-Labadie", "Operative Heuristic Challenge", "backlog"],
      ["9", "Kohler Group", "Re-Contextualized Multi-Tasking Attitude", "backlog"],
      ["10", "Romaguera Inc", "Managed Foreground Toolset", "backlog"],
      ["11", "Reilly-King", "Future-Proofed Interactive Toolset", "complete"],
      ["12", "Emard, Champlin and Runolfsdottir", "Devolved Needs-Based Capability", "backlog"],
      ["13", "Fritsch, Cronin and Wolff", "Open-Source 3Rdgeneration Website", "complete"],
      ["14", "Borer LLC", "Profit-Focused Incremental Orchestration", "backlog"],
      ["15", "Emmerich-Ankunding", "User-Centric Stable Extranet", "in-progress"],
      ["16", "Willms-Abbott", "Progressive Bandwidth-Monitored Access", "in-progress"],
      ["17", "Brekke PLC", "Intuitive User-Facing Customerloyalty", "complete"],
      ["18", "Bins, Toy and Klocko", "Integrated Assymetric Software", "backlog"],
      ["19", "Hodkiewicz-Hayes", "Programmable Systematic Securedline", "backlog"],
      ["20", "Murphy, Lang and Ferry", "Organized Explicit Access", "backlog"],
    ].map((companyDetails) => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  }
  renderSwimlane(name, clients, ref) {
    return <Swimlane name={name} clients={clients} dragulaRef={ref} />;
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4 Swimlane-column">
              {this.renderSwimlane("Backlog", this.state.clients.backlog, this.swimlanes.backlog)}
            </div>
            <div className="col-md-4 Swimlane-column">
              {this.renderSwimlane("In Progress", this.state.clients.inProgress, this.swimlanes.inProgress)}
            </div>
            <div className="col-md-4 Swimlane-column">
              {this.renderSwimlane("Complete", this.state.clients.complete, this.swimlanes.complete)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
