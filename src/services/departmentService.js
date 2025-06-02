import { toast } from 'react-toastify'

class DepartmentService {
  constructor() {
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'department'
  }

  async fetchDepartments(searchParams = {}) {
    try {
      const params = {
        fields: [
          'Id', 'Name', 'Tags', 'Owner',
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
      console.error("Error fetching departments:", error)
      toast.error('Failed to load departments')
      return []
    }
  }

  async getDepartmentById(departmentId) {
    try {
      const params = {
        fields: [
          'Id', 'Name', 'Tags', 'Owner',
          'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy'
        ]
      }

      const response = await this.apperClient.getRecordById(this.tableName, departmentId, params)
      
      if (!response || !response.data) {
        toast.error('Department not found')
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching department with ID ${departmentId}:`, error)
      toast.error('Failed to load department details')
      return null
    }
  }

  async createDepartment(departmentData) {
    try {
      // Filter to only include updateable fields
      const updateableFields = {
        Name: departmentData.Name,
        Tags: departmentData.Tags,
        Owner: departmentData.Owner
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
          toast.success('Department created successfully!')
          return successfulRecords[0].data
        }
      }

      toast.error('Failed to create department')
      return null
    } catch (error) {
      console.error("Error creating department:", error)
      toast.error('Failed to create department')
      throw error
    }
  }

  async updateDepartment(departmentId, departmentData) {
    try {
      // Filter to only include updateable fields
      const updateableFields = {
        Id: departmentId,
        Name: departmentData.Name,
        Tags: departmentData.Tags,
        Owner: departmentData.Owner
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
            toast.error(record.message || "Failed to update department")
          })
        }

        if (successfulUpdates.length > 0) {
          toast.success('Department updated successfully!')
          return successfulUpdates[0].data
        }
      }

      toast.error('Failed to update department')
      return null
    } catch (error) {
      console.error("Error updating department:", error)
      toast.error('Failed to update department')
      throw error
    }
  }

  async deleteDepartment(departmentId) {
    try {
      const params = {
        RecordIds: [departmentId]
      }

      const response = await this.apperClient.deleteRecord(this.tableName, params)

      if (response && response.success && response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)

        if (failedDeletions.length > 0) {
          failedDeletions.forEach(record => {
            toast.error(record.message || "Failed to delete department")
          })
        }

        if (successfulDeletions.length > 0) {
          toast.success('Department deleted successfully!')
          return true
        }
      }

      toast.error('Failed to delete department')
      return false
    } catch (error) {
      console.error("Error deleting department:", error)
      toast.error('Failed to delete department')
      throw error
    }
  }
}

export default new DepartmentService()