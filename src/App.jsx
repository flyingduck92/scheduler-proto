import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule'
import './App.css'
import EditorTemplateForm from './components/EditorTemplateForm'

// Helper to get a random date in the current month
function getRandomDateInCurrentMonth(hour = 10, minute = 0) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  // Get number of days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // Pick a random day
  const day = Math.floor(Math.random() * daysInMonth) + 1
  return new Date(year, month, day, hour, minute)
}

function App() {
  const data = Array.from({ length: 10 }).map((_, i) => {
    const start = getRandomDateInCurrentMonth(10, 0)
    const end = new Date(start.getTime() + 60 * 60 * 1000)

    return {
      Id: i + 1,
      Subject: `Meeting ${i + 1}`,
      Location: 'Lab LID',
      StartTime: start,
      EndTime: end,
      isAllDay: false,
    }
  })

  const fieldsData = {
    id: 'Id',
    subject: { name: 'Subject' },
    location: { name: 'Location' },
    isAllDay: { name: 'IsAllDay' },
    startTime: { name: 'StartTime' },
    endTime: { name: 'EndTime' }
  }

  // Check if Past Date
  function isPastDate(date) {
    if (!date) return false
    const d = new Date(date)
    const now = new Date()
    d.setHours(0, 0, 0, 0)
    now.setHours(0, 0, 0, 0)
    return d < now
  }

  // Disable Edit/Delete if event is in the past
  function handlePopUpOpen(args) {
    const now = new Date()

    // Prevent creating new events on past dates (single/double click)
    if (
      (args.type === 'QuickInfo' && args.target?.classList.contains('e-work-cells')) ||
      (args.type === 'Editor' && args.data)
    ) {
      const cellDate = args.data?.StartTime || args.data?.startTime
      if (isPastDate(cellDate)) {
        args.cancel = true
        return
      }
    }

    if (args.type === 'QuickInfo' && args.data) {
      // get start and end time from event 
      const start = new Date(args.data.StartTime || args.data.startTime)
      const end = new Date(args.data.EndTime || args.data.endTime)
      const isRunning = start <= now && now <= end
      const isCompleted = end < now

      if (isRunning || isCompleted) {
        setTimeout(() => {
          const popUp = document.querySelector('.e-quick-popup-wrapper')

          if (popUp) {
            const editBtn = popUp.querySelector('.e-event-edit')
            const deleteBtn = popUp.querySelector('.e-event-delete')

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

  /* Forms */
  function editorTemplate(props) {
    return <EditorTemplateForm props={props} />
  }

  const eventSettings = { dataSource: data, fields: fieldsData }

  return (
    <>
      <ScheduleComponent
        currentView='Month'
        eventSettings={eventSettings}
        popupOpen={handlePopUpOpen}
        editorTemplate={editorTemplate}
      >
        <ViewsDirective>
          <ViewDirective option='Day' startHour='9:00' endHour='17:00' />
          <ViewDirective option='Week' startHour='9:00' endHour='16:00' />
          <ViewDirective option='WorkWeek' startHour='9:00' endHour='16:00' />
          <ViewDirective option='Month' showWeekend={true} />
          <ViewDirective option='Agenda' />
        </ViewsDirective>
        <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
      </ScheduleComponent>
    </>
  )
}

export default App
