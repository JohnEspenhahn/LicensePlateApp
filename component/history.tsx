import React from "react";
import { ScrollView } from "react-native";
import HistoryItemComponent, { HistoryItem } from "./historyitem";

interface HistoryComponentProps {
  history: string[];
  captures: { [id: string]: HistoryItem };
  onAccept: (id: string) => void;
}

export default function HistoryComponent(props: HistoryComponentProps) {
  return (<ScrollView>
    {props.history.map(
      id => <HistoryItemComponent key={id} id={id} item={props.captures[id]} onAccept={props.onAccept} />
    )}
  </ScrollView>);
}
