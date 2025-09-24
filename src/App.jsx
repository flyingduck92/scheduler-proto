import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule'
import './App.css'

function App() {
  // const data = [
  //   {
  //     Id: 1,
  //     Subject: 'Meeting 1',
  //     Location: 'Lab LID',
  //     StartTime: new Date(2025, 8, 24, 10, 0),
  //     EndTime: new Date(2025, 8, 24, 11, 0),
  //     isAllDay: false,
  //     Status: 'Completed',
  //     Priority: 'High'
  //   }
  // ]
  // const fieldsData = {
  //   id: 'Id',
  //   subject: { name: 'Subject' },
  //   location: { name: 'Location' },
  //   isAllDay: { name: 'IsAllDay' },
  //   startTime: { name: 'StartTime' },
  //   endTime: { name: 'EndTime' }
  // }

  const data = [
    {
      TravelId: 2,
      TravelSummary: 'Paris',
      DepartureTime: new Date(2025, 8, 15, 10, 0),
      ArrivalTime: new Date(2025, 8, 15, 12, 30),
      FullDay: false,
      Source: 'London',
      Comments: 'Summer vacation planned for outstation.',
      Origin: 'Asia/Yekaterinburg',
      Destination: 'Asia/Yekaterinburg'
    },
    {
      TravelId: 1,
      TravelSummary: "Tokyo",
      DepartureTime: new Date(2025, 8, 16, 10, 0, 0),
      ArrivalTime: new Date(2025, 8, 16, 12, 30, 0),
      FullDay: false,
      Source: "Beijing",
      Comments: "Conference on emerging technologies.",
      Origin: "Asia/Yekaterinburg",
      Destination: "Asia/Yekaterinburg",
    }
  ]

  const fieldsData = {
    id: 'TravelId',
    subject: { name: 'TravelSummary' },
    isAllDay: { name: 'FullDay' },
    location: { name: 'Source' },
    description: { name: 'Comments' },
    startTime: { name: 'DepartureTime' },
    endTime: { name: 'ArrivalTime' },
    startTimezone: { name: 'Origin' },
    endTimezone: { name: 'Destination' },
    isBlock: 'IsDisabled',
  }

  const eventSettings = { dataSource: data, fields: fieldsData }

  // Disable Edit/Delete if event is in the past
  const onPopupOpen = (args) => {
    if (args.type === 'QuickInfo' && args.data) {
      // Use ArrivalTime as end time
      const end = args.data.ArrivalTime || args.data.EndTime
      if (end && new Date(end) < new Date()) {
        // Find Edit and Delete buttons in the popup
        setTimeout(() => {
          const popup = document.querySelector('.e-quick-popup-wrapper')
          if (popup) {
            const editBtn = popup.querySelector('.e-event-edit')
            const deleteBtn = popup.querySelector('.e-event-delete')

            /* disable if event already passed */
            if (editBtn) {
              editBtn.classList.add('cursor-not-allowed')
              editBtn.setAttribute('disabled', 'disabled')
              editBtn.style.cursor = 'not-allowed'
            }
            if (deleteBtn) {
              deleteBtn.classList.add('cursor-not-allowed')
              deleteBtn.setAttribute('disabled', 'disabled')
              deleteBtn.style.cursor = 'not-allowed'
            }

            /* display none if event already passed */
            // if (editBtn) editBtn.style.display = 'none'
            // if (deleteBtn) deleteBtn.style.display = 'none'
          }
        }, 0)
      }
    }
  }

  return (
    <>
      <ScheduleComponent
        currentView='Month'
        eventSettings={eventSettings}
        popupOpen={onPopupOpen}
      >
        <ViewsDirective>
          <ViewDirective option='Day' />
          <ViewDirective option='Week' startHour='9:00' endHour='16:00' />
          <ViewDirective option='WorkWeek' startHour='9:00' endHour='16:00' />
          <ViewDirective option='Month' showWeekend={false} />
          <ViewDirective option='Agenda' />
        </ViewsDirective>
        <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
      </ScheduleComponent>
    </>
  )
}

export default App
