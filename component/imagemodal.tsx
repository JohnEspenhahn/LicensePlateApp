import React from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface ImageModalProps {
  visible: boolean;
  close: () => void;

  base64Img: string;
}

export default function ImageModalComponent(props: ImageModalProps) {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="none"
        transparent={true}
        visible={props.visible}
        onRequestClose={props.close}
      >
        <TouchableOpacity style={styles.centeredView} onPress={props.close}>
          <View style={{ minWidth: "60%" }}>
            <TouchableWithoutFeedback>
              <View
                style={{
                  ...styles.modalView,
                  // @ts-ignore
                  cursor: "default",
                }}
              >
                <Image
                  source={{ uri: props.base64Img }}
                  style={{
                    marginBottom: 20,
                    minWidth: 300,
                    width: "100%",
                    height: undefined,
                    aspectRatio: 1,
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(100,100,100,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
