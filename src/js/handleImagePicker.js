import * as ImagePicker from "expo-image-picker";

const handleImagePicker = async (setSelectedImage) => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  } catch (error) {
    console.error("Помилка вибору фото:", error);
  }
};

export default handleImagePicker;
