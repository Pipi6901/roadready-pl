import React from 'react';
import { Keyboard, Platform, type KeyboardEvent } from 'react-native';

/**
 * Height of the on-screen keyboard in px, 0 while it is closed.
 *
 * KeyboardAvoidingView is the usual answer and it is the wrong one here: its
 * `padding` behaviour measures from the bottom of the window, so inside a
 * SafeAreaView that has already eaten the home-indicator inset it leaves the
 * bottom button exactly that inset short — covered by the keyboard on every
 * phone with a notch. This reports the real height and lets the screen decide
 * what to do with it.
 */
export function useKeyboardHeight(): number {
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    // iOS gets the "will" pair, so the layout moves with the keyboard's own
    // animation instead of jumping after it; Android only fires "did".
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, (e: KeyboardEvent) =>
      setHeight(e.endCoordinates.height),
    );
    const hide = Keyboard.addListener(hideEvent, () => setHeight(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return height;
}
