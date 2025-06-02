import { toast } from 'react-toastify'

class EmployeeService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'employee2'
  }

  async fetchEmployees(searchParams = {}) {
    try {
      const params = {
        fields: [
          'Id', 'Name', 'first_name', 'last_name', 'email', 'position', 
          'hire_date', 'status', 'avatar', 'department', 'Tags', 'Owner',
          'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
        ],
        ...searchParams
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response || !response.data || response.data.length === 0) {
        return []
      }

      return response.data
    } catch (error) {
      console.error("Error fetching employees:", error)
      toast.error('Failed to load employees')
      return []
    }
  }

  async getEmployeeById(employeeId) {
    try {
      const params = {
        fields: [
          'Id', 'Name', 'first_name', 'last_name', 'email', 'position', 
          'hire_date', 'status', 'avatar', 'department', 'Tags', 'Owner',
          'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
        ]
      }

      const response = await this.apperClient.getRecordById(this.tableName, employeeId, params)
      
      if (!response || !response.data) {
        toast.error('Employee not found')
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching employee with ID ${employeeId}:`, error)
      toast.error('Failed to load employee details')
      return null
    }
  }

  async createEmployee(employeeData) {
    try {
      // Filter to only include updateable fields
      const updateableFields = {
        Name: employeeData.Name || `${employeeData.first_name} ${employeeData.last_name}`,
        first_name: employeeData.first_name,
        last_name: employeeData.last_name,
        email: employeeData.email,
        position: employeeData.position,
        hire_date: employeeData.hire_date,
        status: employeeData.status || 'active',
        avatar: employeeData.avatar,
        department: employeeData.department,
        Tags: employeeData.Tags,
        Owner: employeeData.Owner
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
          toast.success('Employee created successfully!')
          return successfulRecords[0].data
        }
      }

      toast.error('Failed to create employee')
      return null
    } catch (error) {
      console.error("Error creating employee:", error)
      toast.error('Failed to create employee')
      throw error
    }
  }

  async updateEmployee(employeeId, employeeData) {
    try {
      // Filter to only include updateable fields
      const updateableFields = {
        Id: employeeId,
        Name: employeeData.Name,
        first_name: employeeData.first_name,
        last_name: employeeData.last_name,
        email: employeeData.email,
        position: employeeData.position,
        hire_date: employeeData.hire_date,
        status: employeeData.status,
        avatar: employeeData.avatar,
        department: employeeData.department,
        Tags: employeeData.Tags,
        Owner: employeeData.Owner
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
            toast.error(record.message || "Failed to update employee")
          })
        }

        if (successfulUpdates.length > 0) {
          toast.success('Employee updated successfully!')
          return successfulUpdates[0].data
        }
      }

      toast.error('Failed to update employee')
      return null
    } catch (error) {
      console.error("Error updating employee:", error)
      toast.error('Failed to update employee')
      throw error
    }
  }

  async deleteEmployee(employeeId) {
    try {
      const params = {
        RecordIds: [employeeId]
      }

      const response = await this.apperClient.deleteRecord(this.tableName, params)

      if (response && response.success && response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)

        if (failedDeletions.length > 0) {
          failedDeletions.forEach(record => {
            toast.error(record.message || "Failed to delete employee")
          })
        }

        if (successfulDeletions.length > 0) {
          toast.success('Employee deleted successfully!')
          return true
        }
      }

      toast.error('Failed to delete employee')
      return false
    } catch (error) {
      console.error("Error deleting employee:", error)
      toast.error('Failed to delete employee')
      throw error
    }
  }
}

export default new EmployeeService()