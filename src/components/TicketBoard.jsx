import React, { useState, useEffect } from 'react';
import Navbar from './NavBar'; 
import Urgent from '../icons_FEtask/Urgent.svg';
import Nopriority from '../icons_FEtask/Nopriority.svg';
import High from '../icons_FEtask/High.svg';
import Low from '../icons_FEtask/Low.svg';
import Medium from '../icons_FEtask/Medium.svg';
import Todo from '../icons_FEtask/To-do.svg';
import progress from  '../icons_FEtask/inprogress.svg';
import Cancelled from '../icons_FEtask/Cancelled.svg';
import Done from '../icons_FEtask/Done.svg';
import Backlog from '../icons_FEtask/Backlog.svg';
import add from '../icons_FEtask/add.svg';
import dot from '../icons_FEtask/dot.svg';
import styles from './styles/Ticket.module.css'


const TicketBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [grouping, setGrouping] = useState('status');
  const [ordering, setOrdering] = useState('priority');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        const data = await response.json();
        setTickets(data.tickets);
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const priorityMap = {
    0: { type: "No priority", image: Nopriority },
    1: { type: "Low", image: Low },
    2: { type: "Medium", image: Medium },
    3: { type: "High", image: High },
    4: { type: "Urgent", image: Urgent },
  };

  const statusMap = {
    "Backlog": Backlog,
    "Todo": Todo,
    "In progress": progress,
    "Done": Done,
    "Cancelled": Cancelled,
  };

  const statusOrder = ["Backlog", "Todo", "In progress", "Done", "Cancelled"];
  const priorityOrder = ['No priority', 'Urgent', 'High', 'Medium', 'Low'];
  const avatarColors = ['green', 'blue', 'red', 'purple', ];


  const getUserInitials = (userId) => {
    const user = users.find(user => user.id === userId);
    if (!user || !user.name) return 'U';

    const nameParts = user.name.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0][0].toUpperCase();
    }

    const initials = nameParts[0][0].toUpperCase() + nameParts[nameParts.length - 1][0].toUpperCase();
    return initials;
  };


  const isUserAvailable = (userId) => {
    const user = users.find(user => user.id === userId);
    return user?.available || false;
  };

  const getUserAvatarColor = (userId) => {
    const userIndex = users.findIndex(user => user.id === userId);
    return avatarColors[userIndex % avatarColors.length];
  };

  const getGroupedTickets = () => {
    let grouped = tickets.reduce((acc, ticket) => {
      let key;
      switch (grouping) {
        case 'status':
          key = ticket.status;
          break;
        case 'user':
          key = users.find(user => user.id === ticket.userId)?.name || 'Unassigned';
          break;
        case 'priority':
          key = ticket.priority;
          break;
        default:
          key = 'Other';
      }
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(ticket);
      return acc;
    }, {});

   
    if (grouping === 'status') {
      Object.keys(statusMap).forEach(status => {
        if (!grouped[status]) {
          grouped[status] = [];
        }
      });
    }

    return grouped;
  };

  const sortTickets = (ticketsArray) => {
    return ticketsArray.sort((a, b) => {
      switch (ordering) {
        case 'priority':
          return b.priority - a.priority;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  
  

  const getPriorityLabel = (priority) => {
  return priorityMap[priority].type;
  };

  const renderTicket = (ticket) => (
    <div key={ticket.id} className={styles.card}>
      <div className={styles.cardHeading}>
        <span className={styles.ticketId}>{ticket.id}</span>
        {grouping !== 'user' && (
        <div className={styles.userAvatar} title={users.find(user => user.id === ticket.userId)?.name || 'Unassigned'}  style={{ backgroundColor: getUserAvatarColor(ticket.userId) }}>
          {getUserInitials(ticket.userId)}
          <span className={`${styles.status} ${isUserAvailable(ticket.userId) ? styles.available : styles.unavailable}`}></span>

        </div>
        )}
      </div>
      <div className={styles.ticketHeading}>
        {grouping !== 'status' && (
          <span><img src={statusMap[ticket.status]} alt={ticket.status} className={styles.priorityImage} /></span>
        )}
        <h3 className={styles.cardTitle}>{ticket.title}</h3>
      </div>
      <div className={styles.cardTags}>
        {grouping !== 'priority' && (
            <span className={`${styles.tag} ${styles.priority}`}>

            <img src={priorityMap[ticket.priority].image} alt={priorityMap[ticket.priority].type} className={styles.priorityImage} />
          </span>
        )}
        {ticket.tag.map((tag, index) => (
          <span key={index} className={styles.tag}>
            <span className={styles.tagIcon}></span>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  const groupedTickets = getGroupedTickets();
  Object.keys(groupedTickets).forEach(key => {
    groupedTickets[key] = sortTickets(groupedTickets[key]);
  });

  

  


  return (
    <>
      <Navbar grouping={grouping} setGrouping={setGrouping} ordering={ordering} setOrdering={setOrdering} />
      <div className={styles.space}>
        <div className={styles.columns}>
          {grouping === 'status' ? (
            statusOrder.map((status) => (
              <div key={status} className={styles.column}>
                <div className={styles.columnHeading}>
                  <div className={styles.headerIcon}>
                    <img src={statusMap[status]} alt={status} className={styles.statusHeaderImage} />
                    <span>{status}</span>  <div> {groupedTickets[status]?.length || 0} </div>
                  </div>
                  <div className={styles.headerAdd}>
                    <img src={add} alt="ADD" />
                    <img src={dot} alt="Dot"  />
                  </div>
                </div>

                <div className={styles.columnInfo}>
                  {groupedTickets[status]?.map(renderTicket)}
                </div>
              </div>
            ))
          )  : (
            Object.entries(groupedTickets)
            .sort(([groupA], [groupB]) => {
              if (grouping === 'priority') {
                const labelA = getPriorityLabel(groupA);
                const labelB = getPriorityLabel(groupB);
                return priorityOrder.indexOf(labelA) - priorityOrder.indexOf(labelB);
              }
              return grouping === 'user' ? groupA.localeCompare(groupB) : 0;
            })
            .map(([group, groupTickets]) => (
              <div key={group} className={styles.column}>
                <div className={styles.columnHeading}>
                  <div className={styles.headerIcon}>
                    {grouping === 'priority' ? (
                      <>
                        <img src={priorityMap[group].image} alt={priorityMap[group].type} className={styles.priorityHeaderImage} />
                        <span>{priorityMap[group].type}    {groupTickets.length}</span>
                      </>
                    ) : grouping === 'user' ? (
                  <>
    <div className={styles.userAvatarColumn}>
      <div className={styles.userAvatar} title={group} style={{ backgroundColor: getUserAvatarColor(users.find(user => user.name === group)?.id) }}>
        {getUserInitials(users.find(user => user.name === group)?.id)}
        <span className={`${styles.status} ${isUserAvailable(users.find(user => user.name === group)?.id) ? styles.available : styles.unavailable}`}></span>
      </div>
      <span>{group}  {groupTickets.length}</span>
    </div>
  </>
) : (
                      group
                    )}
                  </div>
                  <div className={styles.headerAdd}>
                    <img src={add} alt="ADD" />
                    <img src={dot} alt="Dot"  />
                  </div>
                </div>

                <div className={styles.columnInfo}>
                  {groupTickets.map(renderTicket)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default TicketBoard;