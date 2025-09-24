import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars'
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule'
import './App.css'

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

  // const data = [
  //   {
  //     Id: 1,
  //     Subject: 'Meeting 1',
  //     Location: 'Lab LID',
  //     StartTime: new Date(2025, 8, 15, 10, 0),
  //     EndTime: new Date(2025, 8, 15, 11, 0),
  //     isAllDay: false,
  //   },
  //   {
  //     Id: 2,
  //     Subject: 'Meeting 2',
  //     Location: 'Lab LID',
  //     StartTime: new Date(2025, 8, 25, 10, 0),
  //     EndTime: new Date(2025, 8, 25, 11, 0),
  //     isAllDay: false,
  //   }
  // ]

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

    // Prevent creating new events on past dates (single click)
    // if (args.type === 'QuickInfo' && args.target?.classList.contains('e-work-cells')) {
    //   const cellDate = args.data?.StartTime || args.data?.startTime
    //   if (cellDate && new Date(cellDate).setHours(0, 0, 0, 0) < now.setHours(0, 0, 0, 0)) {
    //     args.cancel = true
    //     return
    //   }
    // }

    // // Prevent creating new events on past dates (double click)
    // if (args.type === 'Editor' && args.data) {
    //   const cellDate = args.data?.StartTime || args.data?.startTime
    //   if (cellDate && new Date(cellDate).setHours(0, 0, 0, 0) < now.setHours(0, 0, 0, 0)) {
    //     args.cancel = true
    //     return
    //   }
    // }

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


    // Fix Agenda view datepicker dropdown being cut off
    if (
      args.element &&
      args.element.classList.contains('e-header_popup')
    ) {
      setTimeout(() => {
        // Move the popup to the body
        document.body.appendChild(args.element)
        // Set the requested styles
        args.element.style.position = 'fixed'
        args.element.style.zIndex = 1003
        args.element.style.left = '88px'
        args.element.style.top = '48px'
      }, 0)
    }
  }

  function editorTemplate(props) {
    // Use the clicked date for min/max, fallback to today if not available
    const baseDate = props.StartTime
      ? new Date(props.StartTime)
      : new Date()

    // Default to 9:00 and 10:00 for new events if not provided
    function getDefaultTime(hour) {
      return new Date(
        baseDate.getFullYear(),
        baseDate.getMonth(),
        baseDate.getDate(),
        hour, 0, 0
      )
    }

    // Set min to 9:00 AM and max to 5:00 PM on the selected date
    const minTime = getDefaultTime(9)
    const maxTime = getDefaultTime(17)

    // Use getDefaultTime for new event, otherwise use the provided value
    const startTime = props.StartTime || props.startTime || getDefaultTime(9)
    const endTime = props.EndTime || props.endTime || getDefaultTime(10)

    // Validation: is the selected time in the past?
    const now = new Date()
    const isStartPast = new Date(startTime) < now
    const isEndPast = new Date(endTime) < now

    return (
      <div className="custom-event-editor flex flex-col gap-4 w-full">
        <div className="flex items-center w-full">
          <label className="e-textlabel w-28">Title</label>
          <input
            id="Subject"
            className="e-field e-input w-full"
            type="text"
            name="Subject"
            defaultValue={props.Subject || ''}
          />
        </div>
        <div className="flex items-center w-full">
          <label className="e-textlabel w-28">Location</label>
          <input
            id="Location"
            className="e-field e-input w-full"
            type="text"
            name="Location"
            defaultValue={props.Location || ''}
          />
        </div>
        <div className="flex items-center w-full">
          <label className="e-textlabel w-28">Start Time</label>
          <DateTimePickerComponent
            id="StartTime"
            format="dd/MM/yyyy hh:mm a"
            data-name="StartTime"
            value={startTime}
            min={minTime}
            max={maxTime}
            className={`e-field w-full ${isStartPast ? 'border border-red-500' : ''}`}
          />
        </div>
        <div className="flex items-center w-full">
          <label className="e-textlabel w-28">End Time</label>
          <DateTimePickerComponent
            id="EndTime"
            format="dd/MM/yyyy hh:mm a"
            data-name="EndTime"
            value={endTime}
            min={minTime}
            max={maxTime}
            className={`e-field w-full ${isEndPast ? 'border border-red-500' : ''}`}
          />
        </div>
        <div className="flex items-start w-full">
          <label className="e-textlabel w-28 pt-2">Description</label>
          <textarea
            id="Description"
            name="Description"
            className="e-field e-input w-full min-h-[60px]"
            defaultValue={props.Description || ''}
          />
        </div>
      </div>
    )
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
