import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addDays } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [activeTab, setActiveTab] = useState('employees')
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [isAddingEmployee, setIsAddingEmployee] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(new Date())

  // Sample employee data
  const [employees, setEmployees] = useState([
    {
      id: 1,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@company.com',
      department: 'Engineering',
      position: 'Senior Developer',
      status: 'active',
      hireDate: '2022-03-15',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@company.com',
      department: 'Marketing',
      position: 'Marketing Manager',
      status: 'active',
      hireDate: '2021-07-20',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      firstName: 'Emily',
      lastName: 'Rodriguez',
      email: 'emily.rodriguez@company.com',
      department: 'HR',
      position: 'HR Specialist',
      status: 'active',
      hireDate: '2023-01-10',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ])

  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    position: '',
    hireDate: ''
  })

  const [attendance, setAttendance] = useState([
    { employeeId: 1, date: new Date(), checkIn: '09:00', checkOut: '17:30', status: 'present' },
    { employeeId: 2, date: new Date(), checkIn: '08:45', checkOut: '17:15', status: 'present' },
    { employeeId: 3, date: new Date(), checkIn: '09:15', checkOut: null, status: 'present' }
  ])

  const tabs = [
    { id: 'employees', label: 'Employee Management', icon: 'Users' },
    { id: 'attendance', label: 'Attendance Tracking', icon: 'Clock' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' }
  ]

  const departments = ['Engineering', 'Marketing', 'HR', 'Sales', 'Finance', 'Operations']

  const handleAddEmployee = () => {
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email) {
      toast.error('Please fill in all required fields')
      return
    }

    const employee = {
      id: employees.length + 1,
      ...newEmployee,
      status: 'active',
      avatar: `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1507003211169-0a1dd7228f2d' : '1494790108755-2616b612b786'}?w=150&h=150&fit=crop&crop=face`
    }

    setEmployees([...employees, employee])
    setNewEmployee({ firstName: '', lastName: '', email: '', department: '', position: '', hireDate: '' })
    setIsAddingEmployee(false)
    toast.success('Employee added successfully!')
  }

  const handleCheckInOut = (employeeId) => {
    const today = new Date()
    const existingRecord = attendance.find(record => 
      record.employeeId === employeeId && isSameDay(record.date, today)
    )

    if (existingRecord && !existingRecord.checkOut) {
      // Check out
      const checkOutTime = format(new Date(), 'HH:mm')
      setAttendance(attendance.map(record => 
        record.employeeId === employeeId && isSameDay(record.date, today)
          ? { ...record, checkOut: checkOutTime }
          : record
      ))
      toast.success('Checked out successfully!')
    } else if (!existingRecord) {
      // Check in
      const checkInTime = format(new Date(), 'HH:mm')
      setAttendance([...attendance, {
        employeeId,
        date: today,
        checkIn: checkInTime,
        checkOut: null,
        status: 'present'
      }])
      toast.success('Checked in successfully!')
    }
  }

  const getWeekDays = () => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 })
    const end = endOfWeek(currentWeek, { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }

  const getAttendanceForDay = (employeeId, day) => {
    return attendance.find(record => 
      record.employeeId === employeeId && isSameDay(record.date, day)
    )
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-2 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 flex-1 sm:flex-none ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-card'
                : 'text-surface-600 hover:bg-white/80'
            }`}
          >
            <ApperIcon name={tab.icon} className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          {activeTab === 'employees' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-surface-800">Employee Management</h2>
                <button
                  onClick={() => setIsAddingEmployee(true)}
                  className="custom-button bg-primary text-white hover:bg-primary-dark flex items-center space-x-2 w-full sm:w-auto justify-center"
                >
                  <ApperIcon name="Plus" className="w-4 h-4" />
                  <span>Add Employee</span>
                </button>
              </div>

              {/* Add Employee Form */}
              <AnimatePresence>
                {isAddingEmployee && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-surface-50 rounded-xl p-6 border border-surface-200"
                  >
                    <h3 className="text-lg font-semibold mb-4">Add New Employee</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="First Name *"
                        value={newEmployee.firstName}
                        onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})}
                        className="custom-input"
                      />
                      <input
                        type="text"
                        placeholder="Last Name *"
                        value={newEmployee.lastName}
                        onChange={(e) => setNewEmployee({...newEmployee, lastName: e.target.value})}
                        className="custom-input"
                      />
                      <input
                        type="email"
                        placeholder="Email *"
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                        className="custom-input"
                      />
                      <select
                        value={newEmployee.department}
                        onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                        className="custom-input"
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Position"
                        value={newEmployee.position}
                        onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                        className="custom-input"
                      />
                      <input
                        type="date"
                        placeholder="Hire Date"
                        value={newEmployee.hireDate}
                        onChange={(e) => setNewEmployee({...newEmployee, hireDate: e.target.value})}
                        className="custom-input"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleAddEmployee}
                        className="custom-button bg-secondary text-white hover:bg-secondary-dark flex-1 sm:flex-none"
                      >
                        Add Employee
                      </button>
                      <button
                        onClick={() => setIsAddingEmployee(false)}
                        className="custom-button bg-surface-200 text-surface-700 hover:bg-surface-300 flex-1 sm:flex-none"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Employee List */}
              <div className="grid gap-4">
                {employees.map((employee) => (
                  <motion.div
                    key={employee.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/60 rounded-xl border border-white/30 hover:shadow-card transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                      <img
                        src={employee.avatar}
                        alt={`${employee.firstName} ${employee.lastName}`}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-surface-800">
                          {employee.firstName} {employee.lastName}
                        </h3>
                        <p className="text-sm text-surface-600">{employee.position}</p>
                        <p className="text-xs text-surface-500">{employee.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        employee.status === 'active' ? 'status-active' : 'status-inactive'
                      }`}>
                        {employee.status}
                      </span>
                      <button
                        onClick={() => setSelectedEmployee(employee)}
                        className="custom-button bg-primary/10 text-primary hover:bg-primary hover:text-white text-sm px-4 py-2"
                      >
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-surface-800">Attendance Tracking</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
                    className="p-2 rounded-lg bg-surface-100 hover:bg-surface-200 transition-colors"
                  >
                    <ApperIcon name="ChevronLeft" className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium px-3">
                    {format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM d')} - {format(endOfWeek(currentWeek, { weekStartsOn: 1 }), 'MMM d, yyyy')}
                  </span>
                  <button
                    onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
                    className="p-2 rounded-lg bg-surface-100 hover:bg-surface-200 transition-colors"
                  >
                    <ApperIcon name="ChevronRight" className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Check-in/out */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {employees.map((employee) => {
                  const todayAttendance = attendance.find(record => 
                    record.employeeId === employee.id && isSameDay(record.date, new Date())
                  )
                  const isCheckedIn = todayAttendance && !todayAttendance.checkOut

                  return (
                    <div key={employee.id} className="bg-white/60 rounded-xl p-4 border border-white/30">
                      <div className="flex items-center space-x-3 mb-3">
                        <img
                          src={employee.avatar}
                          alt={`${employee.firstName} ${employee.lastName}`}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-medium text-surface-800 text-sm">
                            {employee.firstName} {employee.lastName}
                          </h3>
                          <p className="text-xs text-surface-600">{employee.department}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCheckInOut(employee.id)}
                        className={`w-full custom-button text-sm ${
                          isCheckedIn
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-secondary text-white hover:bg-secondary-dark'
                        }`}
                      >
                        {isCheckedIn ? 'Check Out' : 'Check In'}
                      </button>
                      {todayAttendance && (
                        <div className="mt-2 text-xs text-surface-600">
                          In: {todayAttendance.checkIn}
                          {todayAttendance.checkOut && ` | Out: ${todayAttendance.checkOut}`}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Weekly Calendar View */}
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  <div className="grid grid-cols-8 gap-2 mb-2">
                    <div className="p-3 text-sm font-medium text-surface-600">Employee</div>
                    {getWeekDays().map((day) => (
                      <div key={day.toISOString()} className="p-3 text-center">
                        <div className="text-xs text-surface-600">{format(day, 'EEE')}</div>
                        <div className="text-sm font-medium">{format(day, 'd')}</div>
                      </div>
                    ))}
                  </div>
                  {employees.map((employee) => (
                    <div key={employee.id} className="grid grid-cols-8 gap-2 mb-2">
                      <div className="p-3 bg-white/60 rounded-lg">
                        <div className="text-sm font-medium">{employee.firstName} {employee.lastName}</div>
                        <div className="text-xs text-surface-600">{employee.department}</div>
                      </div>
                      {getWeekDays().map((day) => {
                        const dayAttendance = getAttendanceForDay(employee.id, day)
                        return (
                          <div key={day.toISOString()} className="p-3 bg-white/40 rounded-lg text-center">
                            {dayAttendance ? (
                              <div className="space-y-1">
                                <div className="text-xs font-medium text-secondary">
                                  {dayAttendance.checkIn}
                                </div>
                                {dayAttendance.checkOut && (
                                  <div className="text-xs text-surface-600">
                                    {dayAttendance.checkOut}
                                  </div>
                                )}
                                <div className="w-2 h-2 bg-secondary rounded-full mx-auto"></div>
                              </div>
                            ) : (
                              <div className="w-2 h-2 bg-surface-300 rounded-full mx-auto"></div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-surface-800">Analytics Dashboard</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="metric-card">
                  <h3 className="text-lg font-semibold mb-4">Attendance Rate</h3>
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="3"
                          strokeDasharray="94.2, 100"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-surface-800">94%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="metric-card">
                  <h3 className="text-lg font-semibold mb-4">Department Distribution</h3>
                  <div className="space-y-3">
                    {['Engineering', 'Marketing', 'HR'].map((dept, index) => {
                      const counts = [8, 4, 3]
                      const percentages = [53, 27, 20]
                      return (
                        <div key={dept}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{dept}</span>
                            <span>{counts[index]} employees</span>
                          </div>
                          <div className="w-full bg-surface-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentages[index]}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="metric-card">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                        <ApperIcon name="UserPlus" className="w-4 h-4 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">New employee added</p>
                        <p className="text-xs text-surface-600">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Clock" className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Attendance updated</p>
                        <p className="text-xs text-surface-600">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                        <ApperIcon name="FileText" className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Report generated</p>
                        <p className="text-xs text-surface-600">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Employee Detail Modal */}
      <AnimatePresence>
        {selectedEmployee && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEmployee(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Employee Details</h2>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center mb-6">
                <img
                  src={selectedEmployee.avatar}
                  alt={`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}
                  className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold">
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </h3>
                <p className="text-surface-600">{selectedEmployee.position}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-surface-700">Email</label>
                  <p className="text-surface-600">{selectedEmployee.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-700">Department</label>
                  <p className="text-surface-600">{selectedEmployee.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-700">Hire Date</label>
                  <p className="text-surface-600">
                    {selectedEmployee.hireDate ? format(new Date(selectedEmployee.hireDate), 'MMM d, yyyy') : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-surface-700">Status</label>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    selectedEmployee.status === 'active' ? 'status-active' : 'status-inactive'
                  }`}>
                    {selectedEmployee.status}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature