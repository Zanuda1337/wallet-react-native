import * as FileSystem from "expo-file-system";const {StorageAccessFramework} = FileSystem;export const exportJsonFile = async (fileName: string, data: any) => {  try {    const permissions =      await StorageAccessFramework.requestDirectoryPermissionsAsync();    if (!permissions.granted) throw new Error('ACCESS_NOT_GRANTED');    const directoryUri = permissions.directoryUri;    const content = JSON.stringify(data);    const fileUri = await StorageAccessFramework.createFileAsync(      directoryUri,      fileName,      "application/json"    );    await FileSystem.writeAsStringAsync(fileUri, content, {      encoding: FileSystem.EncodingType.UTF8,    });  } catch (e) {    throw new Error(e.message)  }};