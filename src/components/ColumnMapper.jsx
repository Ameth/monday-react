import { useState, useEffect } from 'react'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid' // Para íconos de tipo sólido

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const ColumnMapper = ({ boardId }) => {
  const [columns, setColumns] = useState([])
  const [variables, setVariables] = useState([])
  const [newVariable, setNewVariable] = useState({ key: '', columnId: '' })
  const [emailColumns, setEmailColumns] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    bodyTemplate: '',
    attachments: '',
  })
  const [statusMessage, setStatusMessage] = useState(null) // State to hold success or error messages
  const [isLoading, setIsLoading] = useState(false) // State to track loading status

  useEffect(() => {
    const loadColumns = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/column-list/${boardId}`)
        const data = await response.json()
        const columns = data.columns?.map((col) => ({
          id: col.id,
          title: col.title,
          type: col.type,
        }))
        setColumns(columns)
      } catch (error) {
        console.error('Error loading columns:', error)
      }
    }

    const loadVariables = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/column-mapping/${boardId}`)
        const data = await response.json()

        // Set initial values for email columns and variables from backend data
        setEmailColumns({
          to: data.emails?.to || '',
          cc: data.emails?.cc || '',
          bcc: data.emails?.bcc || '',
          subject: data.subject || '',
          bodyTemplate: data.bodyTemplate || '',
          attachments: data.attachments || '',
        })

        setVariables(data.variables) // Store the current variables in the state
      } catch (error) {
        console.error('Error loading variables:', error)
      }
    }

    loadColumns()
    loadVariables()
  }, [boardId])

  const handleEmailColumnChange = (e) => {
    const { name, value } = e.target
    setEmailColumns({ ...emailColumns, [name]: value })
  }

  const handleVariableChange = (e) => {
    const { name, value } = e.target
    setNewVariable({ ...newVariable, [name]: value })
  }

  const handleDeleteVariable = (variableId) => {
    setVariables((prevVariables) => {
      const updatedVariables = prevVariables.filter(
        (variable) => variable.columnId !== variableId
      )
      //   console.log('Updated variables:', updatedVariables) // Esto se ejecuta correctamente
      return updatedVariables
    })
  }

  const handleAddVariable = () => {
    if (newVariable.key && newVariable.columnId) {
      setVariables((prevVariables) => {
        const exists = prevVariables.some(
          (variable) => variable.columnId === newVariable.columnId
        )
        if (exists) {
          return prevVariables.map((variable) =>
            variable.columnId === newVariable.columnId
              ? { ...variable, variableName: newVariable.key }
              : variable
          )
        } else {
          return [
            ...prevVariables,
            {
              variableName: newVariable.key,
              columnId: newVariable.columnId,
              columnTitle:
                columns.find((col) => col.id === newVariable.columnId)?.title ||
                'Title not found',
            },
          ]
        }
      })
      setNewVariable({ key: '', columnId: '' }) // Reset input after adding/updating
    }
  }

  const handleEditVariable = (variableName) => {
    const variableToEdit = variables.find(
      (variable) => variable.variableName === variableName
    )
    setNewVariable({
      key: variableToEdit.variableName,
      columnId: variableToEdit.columnId,
    })
    // handleDeleteVariable(variableName)
  }

  const onSaveMapping = async (mapping) => {
    setIsLoading(true)
    try {
      const response = await fetch(`${BACKEND_URL}/column-mapping/${boardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mapping }),
      })

      if (response.ok) {
        setStatusMessage({
          type: 'success',
          text: 'Mapping updated successfully!',
        })
      } else {
        throw new Error('Failed to update mapping')
      }
    } catch (error) {
      setStatusMessage({
        type: 'error',
        text: 'Error updating mapping. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }

    setTimeout(() => setStatusMessage(null), 6000) // Clear the message after some seconds
  }

  const handleSave = async () => {
    const formattedMapping = {
      boardId,
      emails: {
        to: emailColumns.to,
        cc: emailColumns.cc,
        bcc: emailColumns.bcc,
      },
      subject: emailColumns.subject,
      bodyTemplate: emailColumns.bodyTemplate,
      attachments: emailColumns.attachments,
      variables: variables
    }
    await onSaveMapping(formattedMapping)
  }

  return (
    <div className='max-w-2xl mx-auto mt-4 bg-slate-700 text-gray-200 shadow-md rounded-lg p-8'>
      <h3 className='text-2xl text-center font-semibold text-sky-400'>
        Manage Column Mapping
      </h3>
      <h3 className='text-center text-gray-300 mb-6'>Board: {boardId}</h3>

      <div className='mb-6'>
        <h4 className='font-bold text-sky-400 mb-2'>Email Columns</h4>
        <p className='my-1 text-gray-300'>
          Select the appropriate columns for each part of the email.
        </p>
        <div className='grid gap-4'>
          <div className='flex flex-col'>
            <label className='text-sm text-gray-400 mb-1'>To Email</label>
            <select
              name='to'
              value={emailColumns.to}
              onChange={handleEmailColumnChange}
              className='p-3 border rounded-lg shadow-sm bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring focus:ring-blue-500'
            >
              <option value=''>(No column selected)</option>
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
          </div>
          <div className='flex flex-col'>
            <label className='text-sm text-gray-400 mb-1'>CC Email</label>
            <select
              name='cc'
              value={emailColumns.cc}
              onChange={handleEmailColumnChange}
              className='p-3 border rounded-lg shadow-sm bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring focus:ring-blue-500'
            >
              <option value=''>(No column selected)</option>
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
          </div>
          <div className='flex flex-col'>
            <label className='text-sm text-gray-400 mb-1'>BCC Email</label>
            <select
              name='bcc'
              value={emailColumns.bcc}
              onChange={handleEmailColumnChange}
              className='p-3 border rounded-lg shadow-sm bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring focus:ring-blue-500'
            >
              <option value=''>(No column selected)</option>
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
          </div>
          <div className='flex flex-col'>
            <label className='text-sm text-gray-400 mb-1'>Subject</label>
            <select
              name='subject'
              value={emailColumns.subject}
              onChange={handleEmailColumnChange}
              className='p-3 border rounded-lg shadow-sm bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring focus:ring-blue-500'
            >
              <option value=''>(No column selected)</option>
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
          </div>
          <div className='flex flex-col'>
            <label className='text-sm text-gray-400 mb-1'>Body Template</label>
            <select
              name='bodyTemplate'
              value={emailColumns.bodyTemplate}
              onChange={handleEmailColumnChange}
              className='p-3 border rounded-lg shadow-sm bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring focus:ring-blue-500'
            >
              <option value=''>(No column selected)</option>
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
          </div>
          <div className='flex flex-col'>
            <label className='text-sm text-gray-400 mb-1'>Attachments</label>
            <select
              name='attachments'
              value={emailColumns.attachments}
              onChange={handleEmailColumnChange}
              className='p-3 border rounded-lg shadow-sm bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring focus:ring-blue-500'
            >
              <option value=''>(No column selected)</option>
              {columns
                .filter((col) => col.type === 'file')
                .map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      <div className='mb-6'>
        <h4 className='font-bold text-sky-400 mb-2'>Add New Variable</h4>
        <div className='flex flex-col md:flex-row gap-4 items-center mb-4'>
          <input
            type='text'
            placeholder='Variable name'
            name='key'
            value={newVariable.key}
            onChange={handleVariableChange}
            className='w-full md:w-1/2 p-3 border rounded-lg shadow-sm bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring focus:ring-blue-500'
          />
          <select
            name='columnId'
            value={newVariable.columnId}
            onChange={handleVariableChange}
            className='w-full md:w-1/2 p-3 border rounded-lg shadow-sm bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring focus:ring-blue-500'
          >
            <option value=''>Select a column...</option>
            {columns.map((col) => (
              <option key={col.id} value={col.id}>
                {col.title}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddVariable}
            className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md transition-all'
          >
            Add Variable
          </button>
        </div>
      </div>
      {/* <span>{JSON.stringify(newVariable)}</span> */}
      {/* <span>{JSON.stringify(variables)}</span> */}

      <h4 className='font-bold text-sky-400 mb-2'>Current Variables</h4>
      <div className='list-disc list-inside bg-gray-800 p-4 rounded-lg shadow-inner'>
        <div className='grid grid-cols-12 gap-2 border-b border-gray-600 pb-2 mb-2'>
          <span className='font-bold text-gray-100 col-span-4'>
            Variable Name
          </span>
          <span className='font-bold text-gray-100 col-span-5'>
            Related Column Name
          </span>
          <span className='font-bold text-gray-100 col-span-3 text-center'>
            Actions
          </span>
        </div>
        <ul className='hover:[&>li]:bg-gray-700 hover:[&>li]:text-gray-200 transition-all'>
          {variables.map((variable, index) => (
            <li
              key={index}
              className='grid grid-cols-12 gap-2 py-2 items-center rounded-sm'
            >
              <span className='font-semibold col-span-4'>
                {variable.variableName}
              </span>
              <span className='text-sm text-gray-400 col-span-5'>
                {variable.columnTitle} ({variable.columnId})
              </span>
              <div className='col-span-3 flex justify-center gap-2'>
                <button
                  onClick={() => handleEditVariable(variable.variableName)}
                  className='bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 shadow-sm flex items-center'
                  title='Edit variable'
                >
                  <PencilIcon className='h-5 w-5' />
                </button>
                <button
                  onClick={() => handleDeleteVariable(variable.columnId)}
                  className='bg-red-500 text-white p-2 rounded hover:bg-red-600 shadow-sm flex items-center'
                  title='Delete variable'
                >
                  <TrashIcon className='h-5 w-5' />
                </button>
              </div>
            </li>
          ))}
          {variables.length === 0 && (
            <li className='text-gray-400 text-center'>
              No variables created yet.
            </li>
          )}
        </ul>
      </div>

      <div className='mt-4'>
        <h4 className='font-bold text-sky-400 mb-2'>Instructions</h4>
        <p className='text-gray-300'>
          Use the variables in your message or subject line by enclosing them in
          curly braces <code className='bg-gray-600 px-1 rounded'>{'{}'}</code>.
          For example:
        </p>
        <p className='mt-2 text-gray-300'>
          <code className='bg-gray-600 px-1 rounded'>{'{file_name}'}</code> will
          insert the value of the related column "file_name".
        </p>
      </div>
      <button
        onClick={handleSave}
        disabled={isLoading}
        className={`mt-6 w-full py-3 rounded-lg shadow-lg transition-all text-white ${
          isLoading
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isLoading ? 'Saving...' : 'Save Changes'}
      </button>
      {statusMessage && (
        <div
          className={`mt-4 p-4 rounded-lg text-center ${
            statusMessage.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {isLoading && (
        <div className='flex items-center justify-center mt-4'>
          <div className='animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-opacity-50'></div>
          <span className='ml-2 text-gray-300'>Sending data...</span>
        </div>
      )}
    </div>
  )
}

export default ColumnMapper
