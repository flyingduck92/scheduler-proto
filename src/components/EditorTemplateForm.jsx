import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars'

const EditorTemplateForm = (props) => {
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

export default EditorTemplateForm