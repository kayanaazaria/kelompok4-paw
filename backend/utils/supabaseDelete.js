const { supabase } = require('../config/supabase');

/**
 * Delete a single file from Supabase storage
 * @param {string} filePath - The path of the file in Supabase bucket (e.g., "lampiran/1234567890-abc.pdf")
 * @returns {Promise<{success: boolean, error?: string}>}
 */
const deleteFromSupabase = async (filePath) => {
  try {
    if (!filePath) {
      return { success: false, error: 'File path is required' };
    }

    // Extract just the path without the bucket name if it's included
    const pathOnly = filePath.replace('lampiran/', '');

    const { data, error } = await supabase.storage
      .from('lampiran')
      .remove([pathOnly]);

    if (error) {
      console.error('Supabase delete error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting file from Supabase:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete multiple files from Supabase storage
 * @param {Array<string>} filePaths - Array of file paths in Supabase bucket
 * @returns {Promise<{success: boolean, deletedCount: number, errors: Array}>}
 */
const deleteMultipleFromSupabase = async (filePaths) => {
  try {
    if (!filePaths || !Array.isArray(filePaths) || filePaths.length === 0) {
      return { success: false, deletedCount: 0, errors: ['No file paths provided'] };
    }

    // Extract paths only
    const pathsOnly = filePaths.map(path => path.replace('lampiran/', ''));

    const { data, error } = await supabase.storage
      .from('lampiran')
      .remove(pathsOnly);

    if (error) {
      console.error('Supabase batch delete error:', error);
      return { success: false, deletedCount: 0, errors: [error.message] };
    }

    return { 
      success: true, 
      deletedCount: data.length,
      errors: []
    };
  } catch (error) {
    console.error('Error deleting multiple files from Supabase:', error);
    return { 
      success: false, 
      deletedCount: 0, 
      errors: [error.message] 
    };
  }
};

/**
 * Delete all lampiran files associated with a laporan
 * @param {Array<Object>} lampiran - Array of lampiran objects from laporan document
 * @returns {Promise<{success: boolean, deletedCount: number, errors: Array}>}
 */
const deleteLampiranFiles = async (lampiran) => {
  try {
    if (!lampiran || !Array.isArray(lampiran) || lampiran.length === 0) {
      return { success: true, deletedCount: 0, errors: [] };
    }

    // Extract file paths from lampiran objects
    const filePaths = lampiran
      .filter(file => file.path)
      .map(file => file.path);

    if (filePaths.length === 0) {
      return { success: true, deletedCount: 0, errors: [] };
    }

    return await deleteMultipleFromSupabase(filePaths);
  } catch (error) {
    console.error('Error deleting lampiran files:', error);
    return {
      success: false,
      deletedCount: 0,
      errors: [error.message]
    };
  }
};

module.exports = {
  deleteFromSupabase,
  deleteMultipleFromSupabase,
  deleteLampiranFiles
};
