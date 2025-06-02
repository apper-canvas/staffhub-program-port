import { toast } from 'react-toastify'

class AttendanceService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'attendance'
  }

  async fetchAttendance(searchParams = {}) {
    try {
      const params = {
        fields: [
          'Id', 'Name', 'date', 'check_in', 'check_out', 'status', 'employee',
          'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
        ],
        ...searchParams
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response || !response.data || response.data.length === 0) {
        return []
      }

      return response.data
    } catch (error) {
      console.error("Error fetching attendance:", error)
      toast.error('Failed to load attendance records')
      return []
    }
  }

  async getAttendanceById(attendanceId) {
    try {
      const params = {
        fields: [
          'Id', 'Name', 'date', 'check_in', 'check_out', 'status', 'employee',
          'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
        ]
      }

      const response = await this.apperClient.getRecordById(this.tableName, attendanceId, params)
      
      if (!response || !response.data) {
        toast.error('Attendance record not found')
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching attendance with ID ${attendanceId}:`, error)
      toast.error('Failed to load attendance details')
      return null
    }
  }

  async createAttendance(attendanceData) {
    try {
      // Filter to only include updateable fields
      const updateableFields = {
        Name: attendanceData.Name || `${attendanceData.employee} - ${attendanceData.date}`,
        date: attendanceData.date,
        check_in: attendanceData.check_in,
        check_out: attendanceData.check_out,
        status: attendanceData.status || 'present',
        employee: attendanceData.employee,
        Tags: attendanceData.Tags,
        Owner: attendanceData.Owner
      }

      // Remove any undefined/null values
      Object.keys(updateableFields).forEach(key => {
        if (updateableFields[key] === undefined || updateableFields[key] === null || updateableFields[key] === '') {
          delete updateableFields[key]
        }
      })

      const params = {
        records: [updateableFields]
      }

      const response = await this.apperClient.createRecord(this.tableName, params)

      if (response && response.success && response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)

        if (failedRecords.length > 0) {
          failedRecords.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                toast.error(`${error.fieldLabel}: ${error.message}`)
              })
            } else if (record.message) {
              toast.error(record.message)
            }
          })
        }

        if (successfulRecords.length > 0) {
          toast.success('Attendance record created successfully!')
          return successfulRecords[0].data
        }
      }

      toast.error('Failed to create attendance record')
      return null
    } catch (error) {
      console.error("Error creating attendance:", error)
      toast.error('Failed to create attendance record')
      throw error
    }
  }

  async updateAttendance(attendanceId, attendanceData) {
    try {
      // Filter to only include updateable fields
      const updateableFields = {
        Id: attendanceId,
        Name: attendanceData.Name,
        date: attendanceData.date,
        check_in: attendanceData.check_in,
        check_out: attendanceData.check_out,
        status: attendanceData.status,
        employee: attendanceData.employee,
        Tags: attendanceData.Tags,
        Owner: attendanceData.Owner
      }

      // Remove any undefined/null values (except Id)
      Object.keys(updateableFields).forEach(key => {
        if (key !== 'Id' && (updateableFields[key] === undefined || updateableFields[key] === null)) {
          delete updateableFields[key]
        }
      })

      const params = {
        records: [updateableFields]
      }

      const response = await this.apperClient.updateRecord(this.tableName, params)

      if (response && response.success && response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)

        if (failedUpdates.length > 0) {
          failedUpdates.forEach(record => {
            toast.error(record.message || "Failed to update attendance record")
          })
        }

        if (successfulUpdates.length > 0) {
          toast.success('Attendance record updated successfully!')
          return successfulUpdates[0].data
        }
      }

      toast.error('Failed to update attendance record')
      return null
    } catch (error) {
      console.error("Error updating attendance:", error)
      toast.error('Failed to update attendance record')
      throw error
    }
  }

  async deleteAttendance(attendanceId) {
    try {
      const params = {
        RecordIds: [attendanceId]
      }

      const response = await this.apperClient.deleteRecord(this.tableName, params)

      if (response && response.success && response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)

        if (failedDeletions.length > 0) {
          failedDeletions.forEach(record => {
            toast.error(record.message || "Failed to delete attendance record")
          })
        }

        if (successfulDeletions.length > 0) {
          toast.success('Attendance record deleted successfully!')
          return true
        }
      }

      toast.error('Failed to delete attendance record')
      return false
    } catch (error) {
      console.error("Error deleting attendance:", error)
      toast.error('Failed to delete attendance record')
      throw error
    }
  }

  async getAttendanceForEmployee(employeeId, startDate, endDate) {
    try {
      const params = {
        fields: [
          'Id', 'Name', 'date', 'check_in', 'check_out', 'status', 'employee',
          'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
        ],
        where: [
          {
            fieldName: "employee",
            operator: "EqualTo",
            values: [employeeId.toString()]
          }
        ]
      }

      if (startDate && endDate) {
        params.where.push({
          fieldName: "date",
          operator: "GreaterThanOrEqualTo",
          values: [startDate]
        })
        params.where.push({
          fieldName: "date",
          operator: "LessThanOrEqualTo",
          values: [endDate]
        })
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response || !response.data || response.data.length === 0) {
        return []
      }

      return response.data
    } catch (error) {
      console.error("Error fetching attendance for employee:", error)
      toast.error('Failed to load employee attendance')
      return []
    }
  }

  async getTodayAttendance() {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      const params = {
        fields: [
          'Id', 'Name', 'date', 'check_in', 'check_out', 'status', 'employee',
          'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
        ],
        where: [
          {
            fieldName: "date",
            operator: "EqualTo",
            values: [today]
          }
        ]
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response || !response.data || response.data.length === 0) {
        return []
      }

      return response.data
    } catch (error) {
      console.error("Error fetching today's attendance:", error)
      toast.error('Failed to load today\'s attendance')
      return []
    }
  }
}

export default new AttendanceService()